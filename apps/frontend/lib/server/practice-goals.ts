import {
  getPracticeGoalCompletion,
  listPracticeGoalsForUser,
  setPracticeGoalCompletion,
  upsertPracticeGoal,
  type PracticeGoalCadence as DbPracticeGoalCadence,
  type UpsertPracticeGoalInput,
} from "@repo/db";
import { format } from "date-fns";
import {
  countProblemsInCurrentWeek,
  getPeriodKey,
  sumStudyMinutesInCurrentWeek,
  sumStudyMinutesToday,
} from "@/lib/problems/period";
import type { Problem } from "@/types/problems";
import type {
  PracticeGoalCadence,
  PracticeGoalsPayload,
  PracticeGoalWithProgress,
  UpsertPracticeGoalRequest,
} from "@/types/practice-goals";
import type { StudySession } from "@/types/sessions";

const DEFAULT_TARGETS: Record<
  PracticeGoalCadence,
  UpsertPracticeGoalInput
> = {
  daily: {
    targetProblems: 1,
    targetStudyMinutes: 30,
    contestPrep: false,
  },
  weekly: {
    targetProblems: 5,
    targetStudyMinutes: 180,
    contestPrep: true,
  },
};

function resolveTargets(
  cadence: PracticeGoalCadence,
  saved: Awaited<ReturnType<typeof listPracticeGoalsForUser>>,
): UpsertPracticeGoalInput {
  const row = saved.find((goal) => goal.cadence === cadence);
  if (!row) return DEFAULT_TARGETS[cadence];

  return {
    targetProblems: row.targetProblems,
    targetStudyMinutes: row.targetStudyMinutes,
    contestPrep: row.contestPrep,
  };
}

async function buildGoalWithProgress(
  userId: string,
  cadence: PracticeGoalCadence,
  targets: UpsertPracticeGoalInput,
  problems: Problem[],
  sessions: StudySession[],
): Promise<PracticeGoalWithProgress> {
  const periodKey = getPeriodKey(cadence);
  const todayKey = format(new Date(), "yyyy-MM-dd");

  const solvedProblems =
    cadence === "daily"
      ? problems.filter((problem) => problem.solvedAt === todayKey).length
      : countProblemsInCurrentWeek(problems);

  const studyMinutes =
    cadence === "daily"
      ? sumStudyMinutesToday(sessions, todayKey)
      : sumStudyMinutesInCurrentWeek(sessions);

  let contestPrepDone = false;
  try {
    const completion = await getPracticeGoalCompletion(userId, cadence, periodKey);
    contestPrepDone = completion?.contestPrepDone ?? false;
  } catch (error) {
    if (!isMissingPracticeGoalTable(error)) {
      throw error;
    }
  }

  return {
    targets: {
      cadence,
      targetProblems: targets.targetProblems,
      targetStudyMinutes: targets.targetStudyMinutes,
      contestPrep: targets.contestPrep,
    },
    progress: {
      periodKey,
      solvedProblems,
      studyMinutes,
      contestPrepDone,
    },
  };
}

function isMissingPracticeGoalTable(error: unknown): boolean {
  const candidates: unknown[] = [error];
  if (error instanceof Error && "cause" in error) {
    candidates.push((error as Error & { cause?: unknown }).cause);
  }

  return candidates.some((item) => {
    if (!(item instanceof Error)) return false;
    const message = item.message.toLowerCase();
    return (
      message.includes("practice_goal") && message.includes("does not exist")
    );
  });
}

async function buildDefaultGoalsPayload(
  userId: string,
  problems: Problem[],
  sessions: StudySession[],
): Promise<PracticeGoalsPayload> {
  const [daily, weekly] = await Promise.all([
    buildGoalWithProgress(userId, "daily", DEFAULT_TARGETS.daily, problems, sessions),
    buildGoalWithProgress(userId, "weekly", DEFAULT_TARGETS.weekly, problems, sessions),
  ]);

  return { daily, weekly };
}

export async function fetchPracticeGoalsForUser(
  userId: string,
  problems: Problem[],
  sessions: StudySession[],
): Promise<PracticeGoalsPayload> {
  let saved: Awaited<ReturnType<typeof listPracticeGoalsForUser>> = [];

  try {
    saved = await listPracticeGoalsForUser(userId);
  } catch (error) {
    if (isMissingPracticeGoalTable(error)) {
      console.warn(
        "[fetchPracticeGoalsForUser] practice_goal table missing — run packages/db migration",
      );
      return buildDefaultGoalsPayload(userId, problems, sessions);
    }
    throw error;
  }

  try {
    const [daily, weekly] = await Promise.all([
      buildGoalWithProgress(
        userId,
        "daily",
        resolveTargets("daily", saved),
        problems,
        sessions,
      ),
      buildGoalWithProgress(
        userId,
        "weekly",
        resolveTargets("weekly", saved),
        problems,
        sessions,
      ),
    ]);

    return { daily, weekly };
  } catch (error) {
    if (isMissingPracticeGoalTable(error)) {
      console.warn(
        "[fetchPracticeGoalsForUser] practice_goal_completion table missing — run packages/db migration",
      );
      return buildDefaultGoalsPayload(userId, problems, sessions);
    }
    throw error;
  }
}

export async function savePracticeGoalForUser(
  userId: string,
  request: UpsertPracticeGoalRequest,
  problems: Problem[],
  sessions: StudySession[],
): Promise<PracticeGoalsPayload> {
  await upsertPracticeGoal(userId, request.cadence as DbPracticeGoalCadence, {
    targetProblems: request.targetProblems,
    targetStudyMinutes: request.targetStudyMinutes,
    contestPrep: request.contestPrep,
  });

  return fetchPracticeGoalsForUser(userId, problems, sessions);
}

export async function toggleContestPrepForUser(
  userId: string,
  cadence: PracticeGoalCadence,
  contestPrepDone: boolean,
  problems: Problem[],
  sessions: StudySession[],
): Promise<PracticeGoalsPayload> {
  const periodKey = getPeriodKey(cadence);

  await setPracticeGoalCompletion(
    userId,
    cadence as DbPracticeGoalCadence,
    periodKey,
    contestPrepDone,
  );

  return fetchPracticeGoalsForUser(userId, problems, sessions);
}
