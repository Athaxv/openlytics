import { format, parseISO } from "date-fns";
import type { ContributionDay } from "@/types/dashboard";

export type ContributionWeek = (ContributionDay | null)[];

export const CELL_GAP_DEFAULT = 2;
export const CELL_GAP_COMPACT = 2;
export const CELL_SIZE_DEFAULT = 12;
export const CELL_SIZE_COMPACT = 9;

export function getGraphMetrics(compact: boolean) {
  return {
    cellSize: compact ? CELL_SIZE_COMPACT : CELL_SIZE_DEFAULT,
    cellGap: compact ? CELL_GAP_COMPACT : CELL_GAP_DEFAULT,
  };
}

export function groupContributionByWeeks(days: ContributionDay[]): ContributionWeek[] {
  const today = format(new Date(), "yyyy-MM-dd");
  const weeks: ContributionWeek[] = [];

  for (let i = 0; i < days.length; i += 7) {
    const weekDays = days.slice(i, i + 7);
    const column: ContributionWeek = weekDays.map((day) =>
      day.date > today ? null : day,
    );

    while (column.length < 7) {
      column.push(null);
    }

    weeks.push(column.slice(0, 7));
  }

  return weeks;
}

export function getMonthLabels(
  weeks: ContributionWeek[],
): { weekIndex: number; label: string }[] {
  const labels: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const firstDay = week.find((day) => day !== null);
    if (!firstDay) {
      return;
    }

    const month = parseISO(firstDay.date).getMonth();
    if (month !== lastMonth) {
      labels.push({
        weekIndex,
        label: format(parseISO(firstDay.date), "MMM"),
      });
      lastMonth = month;
    }
  });

  return labels;
}

export function getMonthLabelPositions(
  weeks: ContributionWeek[],
  cellSize: number,
  cellGap: number,
): { weekIndex: number; label: string; offsetPx: number }[] {
  return getMonthLabels(weeks).map(({ weekIndex, label }) => ({
    weekIndex,
    label,
    offsetPx: weekIndex * (cellSize + cellGap),
  }));
}

export function getTotalCount(days: ContributionDay[]): number {
  return days.reduce((sum, day) => sum + day.count, 0);
}

export function getContributionRangeLabel(days: ContributionDay[]): string {
  if (days.length === 0) {
    return `Last ${12} weeks`;
  }

  const weekCount = Math.round(days.length / 7);
  const start = parseISO(days[0]!.date);
  const end = parseISO(days[days.length - 1]!.date);

  if (weekCount <= 16) {
    return `Last ${weekCount} weeks`;
  }

  const startLabel = format(start, "MMM yyyy");
  const endLabel = format(end, "MMM yyyy");

  if (startLabel === endLabel) {
    return startLabel;
  }

  return `${startLabel} – ${endLabel}`;
}

export function getIntensityLevel(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0 || max <= 0) {
    return 0;
  }

  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

export function getMaxCount(days: ContributionDay[]): number {
  return days.reduce((max, day) => Math.max(max, day.count), 0);
}
