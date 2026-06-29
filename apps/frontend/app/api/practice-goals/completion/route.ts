import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { toggleContestPrepForUser } from "@/lib/server/practice-goals";
import { getStudySessionsForUser } from "@/lib/server/study-sessions";
import { fetchProblemsSync } from "@/lib/server/problems-sync";
import type { ToggleContestPrepRequest } from "@/types/practice-goals";

export async function PATCH(request: Request) {
  let userId: string | undefined;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    userId = session?.user.id;
  } catch (error) {
    console.error("[practice-goals/completion] Session check failed:", error);
    return NextResponse.json({ error: "Session check failed" }, { status: 503 });
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ToggleContestPrepRequest;
    if (!body.cadence || body.contestPrepDone == null) {
      return NextResponse.json(
        { error: "cadence and contestPrepDone are required" },
        { status: 400 },
      );
    }

    const [sync, sessions] = await Promise.all([
      fetchProblemsSync(userId),
      getStudySessionsForUser(userId),
    ]);

    const goals = await toggleContestPrepForUser(
      userId,
      body.cadence,
      body.contestPrepDone,
      sync.problems,
      sessions,
    );

    return NextResponse.json(goals);
  } catch (error) {
    console.error("[practice-goals/completion] PATCH failed:", error);
    return NextResponse.json(
      {
        error: "Failed to update completion",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
