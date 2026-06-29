import type { Problem, ProblemsSyncResult } from "@/types/problems";
import type { StudySession } from "@/types/sessions";

export type ContestSource = "codeforces";

export type UpcomingContest = {
  source: ContestSource;
  name: string;
  startTime: string;
  durationSeconds: number;
  url: string;
};

export type ProblemsDaySummary = {
  dayProblem: Problem | null;
  daySolvedCount: number;
  dayStudyMinutes: number;
  upcomingContest: UpcomingContest | null;
};

/** @deprecated Use ProblemsDaySummary */
export type ProblemsTodaySummary = ProblemsDaySummary;

export type ProblemsPageData = {
  initialSync: ProblemsSyncResult;
  summary: ProblemsDaySummary;
  sessions: StudySession[];
};
