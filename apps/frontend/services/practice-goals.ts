import type {
  PracticeGoalsPayload,
  ToggleContestPrepRequest,
  UpsertPracticeGoalRequest,
} from "@/types/practice-goals";

async function parseError(res: Response): Promise<string> {
  const body = (await res.json().catch(() => null)) as {
    message?: string;
    error?: string;
  } | null;
  return body?.message ?? body?.error ?? `Request failed: ${res.status}`;
}

export async function savePracticeGoal(
  request: UpsertPracticeGoalRequest,
): Promise<PracticeGoalsPayload> {
  const res = await fetch("/api/practice-goals", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return (await res.json()) as PracticeGoalsPayload;
}

export async function toggleContestPrepCompletion(
  request: ToggleContestPrepRequest,
): Promise<PracticeGoalsPayload> {
  const res = await fetch("/api/practice-goals/completion", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return (await res.json()) as PracticeGoalsPayload;
}
