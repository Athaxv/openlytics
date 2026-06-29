"use client";

import { useCallback, useState } from "react";
import { BookOpen, CalendarDays, Flame, TrendingUp } from "lucide-react";
import { CodeforcesRatingChart } from "@/components/dashboard/codeforces-rating-chart";
import { ContributionGraph } from "@/components/dashboard/contribution-graph";
import { ProblemsSolvedList } from "@/components/dashboard/problems-solved-list";
import { StatCard } from "@/components/dashboard/stat-card";
import { refreshDashboardData } from "@/services/dashboard";
import type { ContributionDay, DashboardData } from "@/types/dashboard";

const STAT_ICONS = [BookOpen, Flame, CalendarDays, TrendingUp] as const;

function last7Days(contribution: ContributionDay[]): number[] {
  return contribution.slice(-7).map((day) => day.count);
}

function last7Ratings(data: DashboardData): number[] {
  return data.codeforcesRating.history.slice(-7).map((point) => point.rating);
}

function getFirstName(userName: string): string {
  const trimmed = userName.trim();
  if (!trimmed) return "there";
  const first = trimmed.split(/\s+/)[0];
  return first || trimmed;
}

type DashboardClientProps = {
  data: DashboardData;
  userName: string;
};

export function DashboardClient({ data: initialData, userName }: DashboardClientProps) {
  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [activityKey, setActivityKey] = useState(0);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setRefreshError(null);

    try {
      const fresh = await refreshDashboardData();
      setData(fresh);
      setActivityKey((key) => key + 1);
    } catch (error) {
      setRefreshError(
        error instanceof Error ? error.message : "Could not refresh dashboard data.",
      );
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const problemsSparkline = last7Days(data.problemsContribution);
  const ratingSparkline = last7Ratings(data);

  const sparklines = [
    problemsSparkline,
    problemsSparkline,
    problemsSparkline,
    ratingSparkline,
  ];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-3xl font-semibold tracking-tight">
          Hello, {getFirstName(userName)}!
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your coding activity at a glance — problems solved, contest rating, and progress.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {data.stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            {...stat}
            icon={STAT_ICONS[index]}
            variant={index === 3 ? "featured" : "default"}
            sparkline={sparklines[index]}
          />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContributionGraph
            title="Problems solved"
            unit="problem(s)"
            data={data.problemsContribution}
            colorScale="emerald"
          />
        </div>
        <div className="lg:col-span-1">
          <CodeforcesRatingChart data={data.codeforcesRating} />
        </div>
      </section>

      <ProblemsSolvedList
        key={activityKey}
        problems={data.problems}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        refreshError={refreshError}
      />
    </div>
  );
}
