import { and, eq } from "drizzle-orm";
import { db } from "./client";
import { solvedProblem } from "./db/schema";

export type SolvedProblemInput = {
  id: string;
  title: string;
  platform: string;
  difficulty: string;
  topics: string[];
  solveTimeMin: number;
  attempts: number;
  solvedAt: string;
  favorite?: boolean;
  aiNotePreview?: string;
  url?: string;
  submissionId?: string;
  language?: string;
};

export type SolvedProblemDetailFields = {
  description?: string;
  aiConcepts?: string[];
  mistakes?: string[];
  revisionHistory?: { date: string; note: string }[];
  personalNotes?: string;
};

export type SolvedProblemRow = SolvedProblemInput & SolvedProblemDetailFields;

function parseJsonArray<T>(value: string, fallback: T[]): T[] {
  try {
    const parsed = JSON.parse(value) as T[];
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function mapRow(row: typeof solvedProblem.$inferSelect): SolvedProblemRow {
  return {
    id: row.problemId,
    title: row.title,
    platform: row.platform,
    difficulty: row.difficulty,
    topics: parseJsonArray<string>(row.topics, []),
    solveTimeMin: row.solveTimeMin,
    attempts: row.attempts,
    solvedAt: row.solvedAt,
    favorite: false,
    aiNotePreview: row.aiNotePreview,
    url: row.url ?? undefined,
    submissionId: row.submissionId ?? undefined,
    language: row.language ?? undefined,
    description: row.description ?? undefined,
    aiConcepts: parseJsonArray<string>(row.aiConcepts, []),
    mistakes: parseJsonArray<string>(row.mistakes, []),
    revisionHistory: parseJsonArray<{ date: string; note: string }>(
      row.revisionHistory,
      [],
    ),
    personalNotes: row.personalNotes,
  };
}

function shouldUpdateExisting(
  existing: typeof solvedProblem.$inferSelect,
  incoming: SolvedProblemInput,
): boolean {
  if (incoming.solvedAt > existing.solvedAt) return true;
  if (!existing.url && incoming.url) return true;
  if (!existing.submissionId && incoming.submissionId) return true;
  if (existing.topics === "[]" && incoming.topics.length > 0) return true;
  if (existing.difficulty === "medium" && incoming.difficulty !== "medium") {
    return true;
  }
  return false;
}

export async function upsertLeetcodeProblems(
  userId: string,
  problems: SolvedProblemInput[],
): Promise<void> {
  if (problems.length === 0) return;

  const now = new Date();

  for (const problem of problems) {
    if (problem.platform !== "leetcode") continue;

    const existing = await db
      .select()
      .from(solvedProblem)
      .where(
        and(
          eq(solvedProblem.userId, userId),
          eq(solvedProblem.problemId, problem.id),
        ),
      )
      .limit(1);

    if (existing.length === 0) {
      await db.insert(solvedProblem).values({
        userId,
        problemId: problem.id,
        platform: problem.platform,
        title: problem.title,
        difficulty: problem.difficulty,
        topics: JSON.stringify(problem.topics),
        solvedAt: problem.solvedAt,
        solveTimeMin: problem.solveTimeMin,
        attempts: problem.attempts,
        url: problem.url ?? null,
        submissionId: problem.submissionId ?? null,
        language: problem.language ?? null,
        aiNotePreview: problem.aiNotePreview ?? "",
        firstSyncedAt: now,
        lastSyncedAt: now,
      });
      continue;
    }

    const row = existing[0]!;
    if (!shouldUpdateExisting(row, problem)) {
      await db
        .update(solvedProblem)
        .set({ lastSyncedAt: now })
        .where(
          and(
            eq(solvedProblem.userId, userId),
            eq(solvedProblem.problemId, problem.id),
          ),
        );
      continue;
    }

    await db
      .update(solvedProblem)
      .set({
        title: problem.title,
        difficulty: problem.difficulty,
        topics: JSON.stringify(problem.topics),
        solvedAt: problem.solvedAt,
        solveTimeMin: problem.solveTimeMin,
        attempts: problem.attempts,
        url: problem.url ?? row.url,
        submissionId: problem.submissionId ?? row.submissionId,
        language: problem.language ?? row.language,
        aiNotePreview: problem.aiNotePreview ?? row.aiNotePreview,
        lastSyncedAt: now,
      })
      .where(
        and(
          eq(solvedProblem.userId, userId),
          eq(solvedProblem.problemId, problem.id),
        ),
      );
  }
}

export async function getSolvedProblemsForUser(
  userId: string,
  platform?: string,
): Promise<SolvedProblemRow[]> {
  const conditions = platform
    ? and(eq(solvedProblem.userId, userId), eq(solvedProblem.platform, platform))
    : eq(solvedProblem.userId, userId);

  const rows = await db.select().from(solvedProblem).where(conditions);

  return rows.map(mapRow);
}

export async function getSolvedProblemById(
  userId: string,
  problemId: string,
): Promise<SolvedProblemRow | null> {
  const rows = await db
    .select()
    .from(solvedProblem)
    .where(
      and(
        eq(solvedProblem.userId, userId),
        eq(solvedProblem.problemId, problemId),
      ),
    )
    .limit(1);

  return rows[0] ? mapRow(rows[0]) : null;
}

export async function countSolvedProblemsForUser(
  userId: string,
  platform?: string,
): Promise<number> {
  const rows = await getSolvedProblemsForUser(userId, platform);
  return rows.length;
}
