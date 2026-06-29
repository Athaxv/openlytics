import {
  endOfWeek,
  format,
  isWithinInterval,
  parseISO,
  startOfWeek,
} from "date-fns";
import type { PracticeGoalCadence } from "@/types/practice-goals";
import type { Problem } from "@/types/problems";
import type { StudySession } from "@/types/sessions";

export function getPeriodKey(
  cadence: PracticeGoalCadence,
  date: Date = new Date(),
): string {
  if (cadence === "daily") {
    return format(date, "yyyy-MM-dd");
  }

  return format(date, "yyyy-'W'II");
}

export function countProblemsInCurrentWeek(problems: Problem[]): number {
  const anchor = new Date();
  const weekStart = startOfWeek(anchor, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(anchor, { weekStartsOn: 0 });
  const interval = { start: weekStart, end: weekEnd };

  return problems.filter((problem) =>
    isWithinInterval(parseISO(problem.solvedAt), interval),
  ).length;
}

export function sumStudyMinutesInCurrentWeek(sessions: StudySession[]): number {
  const anchor = new Date();
  const weekStart = startOfWeek(anchor, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(anchor, { weekStartsOn: 0 });
  const interval = { start: weekStart, end: weekEnd };

  return sessions
    .filter((session) => isWithinInterval(parseISO(session.startedAt), interval))
    .reduce((sum, session) => sum + session.durationMin, 0);
}

export function sumStudyMinutesToday(
  sessions: StudySession[],
  todayKey: string,
): number {
  return sessions
    .filter(
      (session) => format(parseISO(session.startedAt), "yyyy-MM-dd") === todayKey,
    )
    .reduce((sum, session) => sum + session.durationMin, 0);
}
