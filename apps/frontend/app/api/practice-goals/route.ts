import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  fetchPracticeGoalsForUser,
  savePracticeGoalForUser,
} from "@/lib/server/practice-goals";
import { getStudySessionsForUser } from "@/lib/server/study-sessions";
import { fetchProblemsSync } from "@/lib/server/problems-sync";
import type { UpsertPracticeGoalRequest } from "@/types/practice-goals";

async function getAuthedUserId(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user.id ?? null;
  } catch {
    return null;
  }
}

export async function GET() {
  const userId = await getAuthedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [sync, sessions] = await Promise.all([
      fetchProblemsSync(userId),
      getStudySessionsForUser(userId),
    ]);
    const goals = await fetchPracticeGoalsForUser(userId, sync.problems, sessions);
    return NextResponse.json(goals);
  } catch (error) {
    console.error("[practice-goals] GET failed:", error);
    return NextResponse.json(
      {
        error: "Failed to load practice goals",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const userId = await getAuthedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as UpsertPracticeGoalRequest;
    if (!body.cadence) {
      return NextResponse.json({ error: "cadence is required" }, { status: 400 });
    }

    const [sync, sessions] = await Promise.all([
      fetchProblemsSync(userId),
      getStudySessionsForUser(userId),
    ]);

    const goals = await savePracticeGoalForUser(
      userId,
      body,
      sync.problems,
      sessions,
    );
    return NextResponse.json(goals);
  } catch (error) {
    console.error("[practice-goals] PUT failed:", error);
    return NextResponse.json(
      {
        error: "Failed to save practice goal",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
