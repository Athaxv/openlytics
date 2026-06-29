import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfWeek,
  subDays,
  subWeeks,
} from "date-fns";
import type {
  CodeforcesRatingSummary,
  ContributionDay,
  DashboardData,
  StatCardData,
} from "@/types/dashboard";
import type { Problem } from "@/types/problems";

const MAX_WEEKS = 52;
const MIN_WEEKS = 8;
const EMPTY_WEEKS = 12;

type ContributionRange = "adaptive" | "full";

function resolveContributionStart<T>(
  items: T[],
  getDateKey: (item: T) => string,
  end: Date,
  range: ContributionRange,
): Date {
  const maxStart = startOfWeek(subWeeks(end, MAX_WEEKS), { weekStartsOn: 0 });

  if (range === "full") {
    return maxStart;
  }

  const minStart = startOfWeek(subWeeks(end, MIN_WEEKS), { weekStartsOn: 0 });
  const emptyStart = startOfWeek(subWeeks(end, EMPTY_WEEKS), { weekStartsOn: 0 });

  if (items.length === 0) {
    return emptyStart;
  }

  let earliest = getDateKey(items[0]!);
  for (const item of items) {
    const key = getDateKey(item);
    if (key < earliest) {
      earliest = key;
    }
  }

  const activityStart = startOfWeek(parseISO(earliest), { weekStartsOn: 0 });
  const paddedStart = subWeeks(activityStart, 1);

  let start = paddedStart > maxStart ? paddedStart : maxStart;

  const dayCount = eachDayOfInterval({ start, end }).length;
  if (dayCount < MIN_WEEKS * 7) {
    start = minStart;
  }

  return start;
}

export function buildContributionDays<T>(
  items: T[],
  getDateKey: (item: T) => string,
  getValue: (item: T) => number,
  range: ContributionRange = "adaptive",
): ContributionDay[] {
  const end = startOfDay(new Date());
  const start = resolveContributionStart(items, getDateKey, end, range);

  const counts = new Map<string, number>();
  for (const item of items) {
    const key = getDateKey(item);
    counts.set(key, (counts.get(key) ?? 0) + getValue(item));
  }

  return eachDayOfInterval({ start, end }).map((day) => {
    const date = format(day, "yyyy-MM-dd");
    return { date, count: counts.get(date) ?? 0 };
  });
}

function computeStreak(days: ContributionDay[]): number {
  const counts = new Map(days.map((d) => [d.date, d.count]));
  let cursor = startOfDay(new Date());
  const todayKey = format(cursor, "yyyy-MM-dd");

  if ((counts.get(todayKey) ?? 0) === 0) {
    cursor = subDays(cursor, 1);
  }

  let streak = 0;
  while ((counts.get(format(cursor, "yyyy-MM-dd")) ?? 0) > 0) {
    streak += 1;
    cursor = subDays(cursor, 1);
  }

  return streak;
}

function countProblemsInWeek(problems: Problem[], weekOffset: number): number {
  const anchor = new Date();
  const weekStart = startOfWeek(subWeeks(anchor, weekOffset), { weekStartsOn: 0 });
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
  const interval = { start: weekStart, end: weekEnd };

  return problems.filter((p) => isWithinInterval(parseISO(p.solvedAt), interval)).length;
}

function buildCfRatingStat(cfRating: CodeforcesRatingSummary): StatCardData {
  const lastContest = cfRating.history[cfRating.history.length - 1];
  const value =
    cfRating.currentRating != null ? String(cfRating.currentRating) : "Unrated";

  let delta = "Set CODEFORCES_HANDLE in .env";
  let positive = true;

  if (lastContest) {
    const sign = lastContest.delta >= 0 ? "+" : "";
    delta = `${sign}${lastContest.delta} last contest`;
    positive = lastContest.delta >= 0;
  } else if (cfRating.maxRating != null) {
    delta = `Max ${cfRating.maxRating}`;
    positive = true;
  } else if (cfRating.currentRating != null) {
    delta = cfRating.rank ? capitalizeRank(cfRating.rank) : "Codeforces rating";
    positive = true;
  }

  return {
    title: "CF Rating",
    value,
    delta,
    positive,
  };
}

function capitalizeRank(rank: string): string {
  return rank
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function buildDashboardStats(
  problems: Problem[],
  cfRating: CodeforcesRatingSummary,
): StatCardData[] {
  const totalProblems = problems.length;
  const problemDaysForStreak = buildContributionDays(
    problems,
    (p) => format(parseISO(p.solvedAt), "yyyy-MM-dd"),
    () => 1,
    "full",
  );
  const streak = computeStreak(problemDaysForStreak);
  const thisWeek = countProblemsInWeek(problems, 0);
  const lastWeek = countProblemsInWeek(problems, 1);
  const weekDelta = thisWeek - lastWeek;

  return [
    {
      title: "Total Problems",
      value: String(totalProblems),
      delta: totalProblems === 0 ? "Start solving to track progress" : `${thisWeek} this week`,
      positive: true,
    },
    {
      title: "Daily Streak",
      value: streak === 0 ? "0 days" : `${streak} day${streak === 1 ? "" : "s"}`,
      delta: streak > 0 ? "Keep the momentum going" : "Solve a problem today",
      positive: streak > 0,
    },
    {
      title: "This Week",
      value: String(thisWeek),
      delta:
        weekDelta === 0
          ? "Same as last week"
          : `${weekDelta > 0 ? "+" : ""}${weekDelta} vs last week`,
      positive: weekDelta >= 0,
    },
    buildCfRatingStat(cfRating),
  ];
}

export function buildDashboardData(
  problems: Problem[],
  cfRating: CodeforcesRatingSummary,
): DashboardData {
  const sortedProblems = [...problems].sort(
    (a, b) => parseISO(b.solvedAt).getTime() - parseISO(a.solvedAt).getTime(),
  );

  const problemsContribution = buildContributionDays(
    problems,
    (p) => format(parseISO(p.solvedAt), "yyyy-MM-dd"),
    () => 1,
  );

  return {
    stats: buildDashboardStats(problems, cfRating),
    problemsContribution,
    codeforcesRating: cfRating,
    problems: sortedProblems,
    totalProblems: problems.length,
  };
}
