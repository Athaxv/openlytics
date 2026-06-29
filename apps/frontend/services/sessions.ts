import { sessionsMock } from "@/mock/sessions";
import type { StudySession } from "@/types/sessions";

export type CreateSessionPayload = {
  startedAt: string;
  endedAt: string;
  durationMin: number;
};

export async function getSessions(): Promise<StudySession[]> {
  try {
    const res = await fetch("/api/sessions", { credentials: "include" });

    if (!res.ok) {
      throw new Error(`Failed to load sessions: ${res.status}`);
    }

    return (await res.json()) as StudySession[];
  } catch {
    return [...sessionsMock].sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    );
  }
}

export async function createSession(payload: CreateSessionPayload): Promise<StudySession> {
  const res = await fetch("/api/sessions", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      message?: string;
      error?: string;
    } | null;
    throw new Error(body?.message ?? body?.error ?? `Failed to save session (${res.status})`);
  }

  return res.json() as Promise<StudySession>;
}
