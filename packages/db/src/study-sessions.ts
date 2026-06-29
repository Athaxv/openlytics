import { desc, eq } from "drizzle-orm";
import { db } from "./client";
import { studySession } from "./db/schema";

export type CreateStudySessionInput = {
  startedAt: Date;
  endedAt: Date;
  durationMin: number;
  platform?: string;
  notes?: string;
  problemsSolved?: string[];
  productivityScore?: number;
};

export type StudySessionRow = {
  id: string;
  startedAt: Date;
  endedAt: Date;
  durationMin: number;
  platform: string;
  notes: string;
  problemsSolved: string[];
  productivityScore: number;
};

function mapRow(row: typeof studySession.$inferSelect): StudySessionRow {
  let problemsSolved: string[] = [];
  try {
    problemsSolved = JSON.parse(row.problemsSolved) as string[];
  } catch {
    problemsSolved = [];
  }

  return {
    id: row.id,
    startedAt: row.startedAt,
    endedAt: row.endedAt,
    durationMin: row.durationMin,
    platform: row.platform,
    notes: row.notes,
    problemsSolved,
    productivityScore: row.productivityScore,
  };
}

export async function createStudySession(
  userId: string,
  input: CreateStudySessionInput,
): Promise<StudySessionRow> {
  const id = crypto.randomUUID();
  const now = new Date();

  const [row] = await db
    .insert(studySession)
    .values({
      id,
      userId,
      startedAt: input.startedAt,
      endedAt: input.endedAt,
      durationMin: input.durationMin,
      platform: input.platform ?? "mixed",
      notes: input.notes ?? "",
      problemsSolved: JSON.stringify(input.problemsSolved ?? []),
      productivityScore: input.productivityScore ?? 0,
      createdAt: now,
    })
    .returning();

  return mapRow(row!);
}

export async function listStudySessionsForUser(
  userId: string,
): Promise<StudySessionRow[]> {
  const rows = await db
    .select()
    .from(studySession)
    .where(eq(studySession.userId, userId))
    .orderBy(desc(studySession.startedAt));

  return rows.map(mapRow);
}
