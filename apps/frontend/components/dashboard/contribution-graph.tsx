"use client";

import { format, parseISO } from "date-fns";
import { ContributionGraphScroll } from "@/components/dashboard/contribution-graph-scroll";
import {
  getContributionRangeLabel,
  getGraphMetrics,
  getIntensityLevel,
  getMaxCount,
  getMonthLabelPositions,
  getTotalCount,
  groupContributionByWeeks,
} from "@/lib/dashboard/contribution-layout";
import { cn } from "@/lib/utils";
import type { ContributionDay } from "@/types/dashboard";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

type ColorScale = "emerald" | "violet";

const LEVEL_CLASSES: Record<ColorScale, Record<0 | 1 | 2 | 3 | 4, string>> = {
  emerald: {
    0: "border border-border/50 bg-muted",
    1: "bg-emerald-200 dark:bg-emerald-950",
    2: "bg-emerald-400 dark:bg-emerald-900",
    3: "bg-emerald-500 dark:bg-emerald-700",
    4: "bg-emerald-600 dark:bg-emerald-500",
  },
  violet: {
    0: "border border-border/50 bg-muted",
    1: "bg-violet-200 dark:bg-violet-950",
    2: "bg-violet-400 dark:bg-violet-900",
    3: "bg-violet-500 dark:bg-violet-700",
    4: "bg-violet-600 dark:bg-violet-500",
  },
};

type ContributionGraphProps = {
  title: string;
  unit: string;
  data: ContributionDay[];
  colorScale?: ColorScale;
  compact?: boolean;
};

function formatCount(count: number, unit: string): string {
  const label = count === 1 ? unit.replace(/\(s\)$/, "") : unit;
  return `${count} ${label}`;
}

function formatYearTotal(total: number, unit: string): string {
  if (total === 0) {
    return `0 ${unit} this year`;
  }
  return `${formatCount(total, unit)} this year`;
}

export function ContributionGraph({
  title,
  unit,
  data,
  colorScale = "emerald",
  compact = false,
}: ContributionGraphProps) {
  const { cellSize, cellGap } = getGraphMetrics(compact);
  const weeks = groupContributionByWeeks(data);
  const monthLabels = getMonthLabelPositions(weeks, cellSize, cellGap);
  const max = getMaxCount(data);
  const total = getTotalCount(data);
  const colors = LEVEL_CLASSES[colorScale];
  const rangeLabel = getContributionRangeLabel(data);
  const scrollKey = `${data.length}-${data[0]?.date ?? ""}`;

  const cellStyle = { width: cellSize, height: cellSize };
  const rowStyle = { gap: cellGap };
  const monthRowHeight = compact ? 12 : 14;

  return (
    <section
      className={cn("rounded-2xl bg-card shadow-sm", compact ? "p-4" : "p-5")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{rangeLabel}</p>
        </div>
        <p className="shrink-0 text-right text-xs text-muted-foreground">
          {formatYearTotal(total, unit)}
        </p>
      </div>

      <ContributionGraphScroll
        className={compact ? "mt-3" : "mt-4"}
        scrollKey={scrollKey}
      >
        <div className="inline-flex min-w-max">
          <div
            className="sticky left-0 z-10 shrink-0 bg-card pr-1.5"
            style={{ width: compact ? 24 : 28 }}
          >
            <div style={{ height: monthRowHeight }} aria-hidden />
            <div className="flex flex-col" style={rowStyle}>
              {WEEKDAY_LABELS.map((label, index) => (
                <div
                  key={index}
                  className="flex items-center text-[11px] text-muted-foreground"
                  style={{ height: cellSize }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="relative" style={{ height: monthRowHeight }}>
              {monthLabels.map(({ weekIndex, label, offsetPx }) => (
                <span
                  key={`${weekIndex}-${label}`}
                  className="absolute top-0 text-[11px] text-muted-foreground"
                  style={{ left: offsetPx }}
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="flex" style={rowStyle}>
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col" style={rowStyle}>
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return (
                        <div
                          key={dayIndex}
                          className="rounded-[3px] bg-transparent"
                          style={cellStyle}
                          aria-hidden
                        />
                      );
                    }

                    const level = getIntensityLevel(day.count, max);
                    const tooltipDate = format(parseISO(day.date), "MMM d, yyyy");
                    const tooltipValue = formatCount(day.count, unit);

                    return (
                      <Tooltip key={day.date}>
                        <TooltipTrigger
                          render={
                            <button
                              type="button"
                              className={cn(
                                "shrink-0 rounded-[3px] outline-none transition-shadow",
                                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                                "motion-safe:hover:ring-2 motion-safe:hover:ring-foreground/20",
                                colors[level],
                              )}
                              style={cellStyle}
                              aria-label={`${tooltipDate}: ${tooltipValue}`}
                            />
                          }
                        />
                        <TooltipContent side="top" className="text-xs">
                          <p className="font-medium">{tooltipDate}</p>
                          <p className="text-muted-foreground">{tooltipValue}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ContributionGraphScroll>

      <div className="mt-4 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
        <span>Less</span>
        {([0, 1, 2, 3, 4] as const).map((level) => (
          <div
            key={level}
            className={cn("rounded-[3px]", colors[level])}
            style={cellStyle}
            aria-hidden
          />
        ))}
        <span>More</span>
      </div>
    </section>
  );
}
