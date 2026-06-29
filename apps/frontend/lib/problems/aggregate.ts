import { format, parseISO } from "date-fns";
import type { UpcomingContest, ProblemsDaySummary } from "@/types/problems-page";
import type { Problem } from "@/types/problems";
import type { StudySession } from "@/types/sessions";

export function buildProblemsDaySummary(
  problems: Problem[],
  sessions: StudySession[],
  dateKey: string,
  upcomingContest: UpcomingContest | null,
): ProblemsDaySummary {
  const dayProblems = problems
    .filter((problem) => problem.solvedAt === dateKey)
    .sort((a, b) => b.id.localeCompare(a.id));

  const dayStudyMinutes = sessions
    .filter((session) => format(parseISO(session.startedAt), "yyyy-MM-dd") === dateKey)
    .reduce((sum, session) => sum + session.durationMin, 0);

  return {
    dayProblem: dayProblems[0] ?? null,
    daySolvedCount: dayProblems.length,
    dayStudyMinutes,
    upcomingContest,
  };
}

export function buildProblemsTodaySummary(
  problems: Problem[],
  sessions: StudySession[],
  upcomingContest: UpcomingContest | null,
): ProblemsDaySummary {
  const todayKey = format(new Date(), "yyyy-MM-dd");
  return buildProblemsDaySummary(problems, sessions, todayKey, upcomingContest);
}
