"use client";

import { format, parseISO } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import type { CodeforcesRatingSummary } from "@/types/dashboard";

type CodeforcesRatingChartProps = {
  data: CodeforcesRatingSummary;
};

type ChartPoint = {
  date: string;
  rating: number;
  contestName: string;
  delta: number;
  label: string;
};

function capitalizeRank(rank: string): string {
  return rank
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildRatingYAxis(ratings: number[]): {
  domain: [number, number];
  ticks: number[];
} {
  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);
  const range = maxRating - minRating;
  const step = range <= 150 ? 50 : range <= 400 ? 100 : 200;
  const yMin = Math.floor((minRating - 50) / step) * step;
  const yMax = Math.ceil((maxRating + 50) / step) * step;

  const ticks: number[] = [];
  for (let tick = yMin; tick <= yMax; tick += step) {
    ticks.push(tick);
  }

  return { domain: [yMin, yMax], ticks };
}

function RatingTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ChartPoint }[];
}) {
  if (!active || !payload?.[0]) {
    return null;
  }

  const point = payload[0].payload;
  const deltaSign = point.delta >= 0 ? "+" : "";

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-foreground">{point.contestName}</p>
      <p className="mt-0.5 text-muted-foreground">
        {format(parseISO(point.date), "MMM d, yyyy")}
      </p>
      <p className="mt-1 text-foreground">
        {point.rating}{" "}
        <span
          className={cn(
            point.delta >= 0 ? "text-emerald-500" : "text-rose-500",
          )}
        >
          ({deltaSign}
          {point.delta})
        </span>
      </p>
    </div>
  );
}

export function CodeforcesRatingChart({ data }: CodeforcesRatingChartProps) {
  const { history, currentRating, rank } = data;
  const lastContest = history[history.length - 1];
  const hasHistory = history.length > 0;

  const chartData: ChartPoint[] = history.map((point) => ({
    date: point.date,
    rating: point.rating,
    contestName: point.contestName,
    delta: point.delta,
    label: format(parseISO(point.date), "MMM"),
  }));

  const ratings = history.map((point) => point.rating);
  const { domain, ticks } = buildRatingYAxis(ratings);

  return (
    <section className="flex h-full flex-col rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium text-foreground">Contest rating</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {rank ? capitalizeRank(rank) : hasHistory ? `${history.length} contests` : "Codeforces"}
          </p>
        </div>
        {currentRating != null ? (
          <div className="text-right">
            <p className="text-2xl font-semibold tracking-tight">{currentRating}</p>
            {lastContest ? (
              <p
                className={cn(
                  "text-xs",
                  lastContest.delta >= 0 ? "text-emerald-500" : "text-rose-500",
                )}
              >
                {lastContest.delta >= 0 ? "+" : ""}
                {lastContest.delta} last
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {!hasHistory ? (
        <div className="mt-6 flex flex-1 flex-col justify-center rounded-lg border border-dashed border-border/80 bg-muted/20 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Connect Codeforces to see rating history
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Set <code className="text-foreground">CODEFORCES_HANDLE</code> in{" "}
            <code className="text-foreground">.env</code>
          </p>
        </div>
      ) : (
        <div className="mt-4 h-[180px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="cfRatingFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={24}
              />
              <YAxis
                type="number"
                domain={domain}
                ticks={ticks}
                allowDecimals={false}
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                width={44}
                tickFormatter={(value) => String(Math.round(value))}
              />
              <Tooltip content={<RatingTooltip />} />
              <Area
                type="monotone"
                dataKey="rating"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#cfRatingFill)"
                isAnimationActive={false}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
