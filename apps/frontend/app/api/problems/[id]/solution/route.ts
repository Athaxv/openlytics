import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchCodeforcesSolution } from "@/lib/integrations/codeforces-solution";
import { fetchLeetcodeSolution } from "@/lib/integrations/leetcode-solution";
import { getProblemDetailFromSync } from "@/lib/server/problems-sync";
import type { ProblemSolution } from "@/types/problems";

const CACHE_TTL_MS = 5 * 60 * 1000;
const solutionCache = new Map<string, { data: ProblemSolution; expiresAt: number }>();

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  let userId: string | undefined;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    userId = session.user.id;
  } catch (error) {
    console.error("[problems/solution] Session check failed:", error);
    return NextResponse.json(
      { error: "Session check failed" },
      { status: 503 },
    );
  }

  const { id } = await context.params;
  const problem = await getProblemDetailFromSync(id, userId);

  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  if (problem.source === "mock" || !problem.submissionId) {
    return NextResponse.json({
      code: "",
      language: problem.language ?? "Unknown",
      available: false,
      message: "No submitted solution for mock data.",
    } satisfies ProblemSolution);
  }

  const cacheKey = `${problem.platform}:${problem.submissionId}`;
  const now = Date.now();
  const cached = solutionCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return NextResponse.json(cached.data);
  }

  try {
    let solution: ProblemSolution;

    if (problem.platform === "leetcode") {
      solution = await fetchLeetcodeSolution(problem.submissionId);
    } else if (problem.platform === "codeforces") {
      solution = await fetchCodeforcesSolution(problem.submissionId);
      if (solution.available && problem.language) {
        solution = { ...solution, language: problem.language };
      }
    } else {
      solution = {
        code: "",
        language: problem.language ?? "Unknown",
        available: false,
        message: "Solution fetch is not supported for this platform yet.",
      };
    }

    solutionCache.set(cacheKey, { data: solution, expiresAt: now + CACHE_TTL_MS });
    return NextResponse.json(solution);
  } catch (error) {
    console.error("[problems/solution] Fetch failed:", error);
    return NextResponse.json({
      code: "",
      language: problem.language ?? "Unknown",
      available: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch solution code.",
    } satisfies ProblemSolution);
  }
}
