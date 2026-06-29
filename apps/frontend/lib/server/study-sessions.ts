import {
  createStudySession,
  listStudySessionsForUser,
  type StudySessionRow,
} from "@repo/db";
import type { SessionPlatform, StudySession } from "@/types/sessions";

function toStudySession(row: StudySessionRow): StudySession {
  return {
    id: row.id,
    startedAt: row.startedAt.toISOString(),
    endedAt: row.endedAt.toISOString(),
    durationMin: row.durationMin,
    platform: row.platform as SessionPlatform,
    problemsSolved: row.problemsSolved,
    productivityScore: row.productivityScore,
    notes: row.notes,
  };
}

export async function getStudySessionsForUser(userId: string): Promise<StudySession[]> {
  const rows = await listStudySessionsForUser(userId);
  return rows.map(toStudySession);
}

export async function saveStudySessionForUser(
  userId: string,
  payload: { startedAt: string; endedAt: string; durationMin: number },
): Promise<StudySession> {
  const row = await createStudySession(userId, {
    startedAt: new Date(payload.startedAt),
    endedAt: new Date(payload.endedAt),
    durationMin: payload.durationMin,
    platform: "mixed",
    notes: "",
    problemsSolved: [],
    productivityScore: 0,
  });

  return toStudySession(row);
}
