import { and, eq } from "drizzle-orm";
import { db } from "./client";
import { practiceGoal, practiceGoalCompletion } from "./db/schema";

export type PracticeGoalCadence = "daily" | "weekly";

export type PracticeGoalRow = {
  userId: string;
  cadence: PracticeGoalCadence;
  targetProblems: number;
  targetStudyMinutes: number;
  contestPrep: boolean;
  updatedAt: Date;
};

export type PracticeGoalCompletionRow = {
  userId: string;
  cadence: PracticeGoalCadence;
  periodKey: string;
  contestPrepDone: boolean;
  updatedAt: Date;
};

export type UpsertPracticeGoalInput = {
  targetProblems: number;
  targetStudyMinutes: number;
  contestPrep: boolean;
};

export async function listPracticeGoalsForUser(
  userId: string,
): Promise<PracticeGoalRow[]> {
  const rows = await db
    .select()
    .from(practiceGoal)
    .where(eq(practiceGoal.userId, userId));

  return rows.map((row) => ({
    userId: row.userId,
    cadence: row.cadence as PracticeGoalCadence,
    targetProblems: row.targetProblems,
    targetStudyMinutes: row.targetStudyMinutes,
    contestPrep: row.contestPrep,
    updatedAt: row.updatedAt,
  }));
}

export async function upsertPracticeGoal(
  userId: string,
  cadence: PracticeGoalCadence,
  input: UpsertPracticeGoalInput,
): Promise<PracticeGoalRow> {
  const now = new Date();

  const [row] = await db
    .insert(practiceGoal)
    .values({
      userId,
      cadence,
      targetProblems: input.targetProblems,
      targetStudyMinutes: input.targetStudyMinutes,
      contestPrep: input.contestPrep,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [practiceGoal.userId, practiceGoal.cadence],
      set: {
        targetProblems: input.targetProblems,
        targetStudyMinutes: input.targetStudyMinutes,
        contestPrep: input.contestPrep,
        updatedAt: now,
      },
    })
    .returning();

  return {
    userId: row!.userId,
    cadence: row!.cadence as PracticeGoalCadence,
    targetProblems: row!.targetProblems,
    targetStudyMinutes: row!.targetStudyMinutes,
    contestPrep: row!.contestPrep,
    updatedAt: row!.updatedAt,
  };
}

export async function getPracticeGoalCompletion(
  userId: string,
  cadence: PracticeGoalCadence,
  periodKey: string,
): Promise<PracticeGoalCompletionRow | null> {
  const [row] = await db
    .select()
    .from(practiceGoalCompletion)
    .where(
      and(
        eq(practiceGoalCompletion.userId, userId),
        eq(practiceGoalCompletion.cadence, cadence),
        eq(practiceGoalCompletion.periodKey, periodKey),
      ),
    )
    .limit(1);

  if (!row) return null;

  return {
    userId: row.userId,
    cadence: row.cadence as PracticeGoalCadence,
    periodKey: row.periodKey,
    contestPrepDone: row.contestPrepDone,
    updatedAt: row.updatedAt,
  };
}

export async function setPracticeGoalCompletion(
  userId: string,
  cadence: PracticeGoalCadence,
  periodKey: string,
  contestPrepDone: boolean,
): Promise<PracticeGoalCompletionRow> {
  const now = new Date();

  const [row] = await db
    .insert(practiceGoalCompletion)
    .values({
      userId,
      cadence,
      periodKey,
      contestPrepDone,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [
        practiceGoalCompletion.userId,
        practiceGoalCompletion.cadence,
        practiceGoalCompletion.periodKey,
      ],
      set: {
        contestPrepDone,
        updatedAt: now,
      },
    })
    .returning();

  return {
    userId: row!.userId,
    cadence: row!.cadence as PracticeGoalCadence,
    periodKey: row!.periodKey,
    contestPrepDone: row!.contestPrepDone,
    updatedAt: row!.updatedAt,
  };
}
