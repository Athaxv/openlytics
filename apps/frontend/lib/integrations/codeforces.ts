import type { IntegrationFetchOptions } from "@/lib/integrations/fetch-options";
import { platformFetchInit } from "@/lib/integrations/fetch-options";
import type { Difficulty, Problem } from "@/types/problems";

type CodeforcesProblem = {
  contestId: number;
  index: string;
  name: string;
  rating?: number;
  tags?: string[];
};

type CodeforcesSubmission = {
  id: number;
  contestId: number;
  creationTimeSeconds: number;
  verdict: string;
  programmingLanguage?: string;
  problem: CodeforcesProblem;
};

type CodeforcesResponse = {
  status: string;
  comment?: string;
  result?: CodeforcesSubmission[];
};

function ratingToDifficulty(rating?: number): Difficulty {
  if (!rating) return "medium";
  if (rating < 1200) return "easy";
  if (rating < 1800) return "medium";
  return "hard";
}

function formatSolvedDate(seconds: number): string {
  return new Date(seconds * 1000).toISOString().slice(0, 10);
}

export async function fetchCodeforcesProblems(
  handle: string,
  options?: IntegrationFetchOptions,
): Promise<Problem[]> {
  const url = `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}`;
  const res = await fetch(url, platformFetchInit(options));

  if (!res.ok) {
    throw new Error(`Codeforces API HTTP ${res.status}`);
  }

  const data = (await res.json()) as CodeforcesResponse;

  if (data.status !== "OK" || !data.result) {
    throw new Error(data.comment ?? "Codeforces API returned an error");
  }

  const attemptCounts = new Map<string, number>();
  for (const sub of data.result) {
    const key = `${sub.problem.contestId}-${sub.problem.index}`;
    attemptCounts.set(key, (attemptCounts.get(key) ?? 0) + 1);
  }

  const solved = new Map<string, CodeforcesSubmission>();

  for (const sub of data.result) {
    if (sub.verdict !== "OK") continue;
    const key = `${sub.problem.contestId}-${sub.problem.index}`;
    const existing = solved.get(key);
    if (!existing || sub.creationTimeSeconds > existing.creationTimeSeconds) {
      solved.set(key, sub);
    }
  }

  return Array.from(solved.values()).map((sub) => {
    const { problem, creationTimeSeconds, contestId } = sub;
    const key = `${problem.contestId}-${problem.index}`;
    const problemIndex = problem.index;
    const problemContestId = problem.contestId ?? contestId;

    return {
      id: `cf-${problemContestId}${problemIndex}`,
      title: problem.name,
      platform: "codeforces" as const,
      difficulty: ratingToDifficulty(problem.rating),
      topics: problem.tags ?? [],
      solveTimeMin: 0,
      attempts: attemptCounts.get(key) ?? 1,
      solvedAt: formatSolvedDate(creationTimeSeconds),
      favorite: false,
      aiNotePreview: "",
      source: "live" as const,
      url: `https://codeforces.com/contest/${problemContestId}/problem/${problemIndex}`,
      submissionId: String(sub.id),
      language: sub.programmingLanguage ?? "Unknown",
    };
  });
}
