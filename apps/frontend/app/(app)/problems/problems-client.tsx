"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, formatDistanceToNowStrict, isValid, parseISO } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Info,
  RefreshCw,
  Target,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { DataTable, type Column } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { TopicChip } from "@/components/common/topic-chip";
import { DifficultyBadge } from "@/components/problems/difficulty-badge";
import { FavoriteButton } from "@/components/problems/favorite-button";
import { ProblemsDateNavigator } from "@/components/problems/problems-date-navigator";
import { StatCard } from "@/components/dashboard/stat-card";
import { useProblems } from "@/hooks/use-problems";
import {
  getCachedProblems,
  refreshProblemsPageData,
  seedProblemsCache,
} from "@/services/problems";
import { queryKeys } from "@/lib/query-keys";
import { buildProblemsDaySummary } from "@/lib/problems/aggregate";
import type { Problem, ProblemFilters, ProblemSortField, ProblemsSyncMeta } from "@/types/problems";
import type { ProblemsPageData, UpcomingContest } from "@/types/problems-page";

const defaultFilters: ProblemFilters = {
  search: "",
  sortBy: "solvedAt",
  sortDir: "desc",
  page: 1,
  pageSize: 10,
};

function parseDateParam(value: string | null, todayKey: string): string {
  if (!value) return todayKey;
  const parsed = parseISO(value);
  if (!isValid(parsed) || value.length !== 10) return todayKey;
  if (value > todayKey) return todayKey;
  return value;
}

function ContestBannerLink({ contest }: { contest: UpcomingContest }) {
  const startsIn = formatDistanceToNowStrict(parseISO(contest.startTime), {
    addSuffix: false,
  });

  return (
    <a
      href={contest.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
    >
      <span className="text-muted-foreground">Next contest:</span>
      <span className="max-w-[180px] truncate">{contest.name}</span>
      <span className="text-muted-foreground">• {startsIn}</span>
      <ExternalLink size={12} className="shrink-0 text-muted-foreground" />
    </a>
  );
}

function SyncBanner({
  sync,
  upcomingContest,
}: {
  sync?: ProblemsSyncMeta;
  upcomingContest?: UpcomingContest | null;
}) {
  if (!sync) return null;

  const contestLink = upcomingContest ? (
    <ContestBannerLink contest={upcomingContest} />
  ) : null;

  const cfOk = sync.sources.codeforces === "ok";
  const lcOk = sync.sources.leetcode === "ok";
  const cfSkipped = sync.sources.codeforces === "skipped";
  const lcSkipped = sync.sources.leetcode === "skipped";
  const anyError = sync.sources.codeforces === "error" || sync.sources.leetcode === "error";
  const usingMock = sync.source === "mock";

  const bannerShell = (tone: "muted" | "rose" | "amber" | "emerald", content: ReactNode) => {
    const toneClass =
      tone === "rose"
        ? "border-rose-500/30 bg-rose-500/10"
        : tone === "amber"
          ? "border-amber-500/30 bg-amber-500/10"
          : tone === "emerald"
            ? "border-emerald-500/30 bg-emerald-500/10"
            : "border-border bg-muted/50";

    return (
      <div
        className={`flex flex-col gap-3 rounded-lg border px-4 py-3 text-sm sm:flex-row sm:items-start sm:justify-between ${toneClass}`}
      >
        <div className="min-w-0 flex-1">{content}</div>
        {contestLink ? <div className="shrink-0">{contestLink}</div> : null}
      </div>
    );
  };

  if (usingMock && !sync.errors?.length) {
    return bannerShell(
      "muted",
      <div className="flex items-start gap-2">
        <Info size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
        <p className="text-muted-foreground">
          Showing mock problems. Set <code className="text-xs">CODEFORCES_HANDLE</code> and{" "}
          <code className="text-xs">LEETCODE_USERNAME</code> in <code className="text-xs">.env</code>{" "}
          with <code className="text-xs">NEXT_PUBLIC_USE_MOCK=false</code> for live data.
        </p>
      </div>,
    );
  }

  if (usingMock && sync.errors?.length) {
    return bannerShell(
      "rose",
      <div className="flex items-start gap-2">
        <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-400" />
        <div>
          <p className="font-medium text-rose-400">Platform sync failed — showing mock data</p>
          <ul className="mt-1 list-inside list-disc text-muted-foreground">
            {sync.errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      </div>,
    );
  }

  if (anyError) {
    return bannerShell(
      "amber",
      <div className="flex items-start gap-2">
        <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-400" />
        <div>
          <p className="font-medium text-amber-400">
            Showing {sync.liveCount ?? 0} live problems — some platforms failed
          </p>
          {sync.errors && (
            <ul className="mt-1 list-inside list-disc text-muted-foreground">
              {sync.errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      </div>,
    );
  }

  const platforms: string[] = [];
  if (cfOk) platforms.push("Codeforces");
  if (lcOk) platforms.push("LeetCode");

  return bannerShell(
    "emerald",
    <div className="flex items-start gap-2">
      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" />
      <div>
        <p className="font-medium text-emerald-400">
          Showing {sync.liveCount ?? 0} problems from {platforms.join(" + ")}
        </p>
        {lcOk && sync.leetcodeStoredCount != null ? (
          <p className="mt-1 text-xs text-muted-foreground">
            {sync.leetcodeStoredCount} LeetCode solves stored — history grows with each refresh.
          </p>
        ) : null}
        {(cfSkipped || lcSkipped) && (
          <p className="mt-1 text-xs text-muted-foreground">
            Configure missing handles in <code className="text-xs">.env</code> to sync more
            platforms.
          </p>
        )}
      </div>
    </div>,
  );
}

type ProblemsPageClientProps = {
  data: ProblemsPageData;
};

export function ProblemsPageClient({ data }: ProblemsPageClientProps) {
  const queryClient = useQueryClient();
  const [pageData, setPageData] = useState(data);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  seedProblemsCache(pageData.initialSync);

  const router = useRouter();
  const searchParams = useSearchParams();
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const selectedDateKey = parseDateParam(searchParams.get("date"), todayKey);
  const isViewingToday = selectedDateKey === todayKey;

  const [filters, setFilters] = useState<ProblemFilters>(defaultFilters);

  const queryFilters = useMemo(
    () => ({
      ...filters,
      solvedDate: selectedDateKey,
    }),
    [filters, selectedDateKey],
  );

  const { data: problemsData, isLoading } = useProblems(queryFilters);

  const allProblems = getCachedProblems();

  const countsByDate = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const problem of allProblems) {
      counts[problem.solvedAt] = (counts[problem.solvedAt] ?? 0) + 1;
    }
    return counts;
  }, [allProblems]);

  const handleDateChange = (dateKey: string) => {
    setFilters((prev) => ({ ...prev, page: 1 }));
    const params = new URLSearchParams(searchParams.toString());
    if (dateKey === todayKey) {
      params.delete("date");
    } else {
      params.set("date", dateKey);
    }
    const query = params.toString();
    router.replace(query ? `/problems?${query}` : "/problems", { scroll: false });
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setRefreshError(null);
    try {
      const fresh = await refreshProblemsPageData();
      setPageData(fresh);
      await queryClient.invalidateQueries({ queryKey: queryKeys.problems.all });
    } catch (error) {
      setRefreshError(
        error instanceof Error ? error.message : "Could not refresh problems data.",
      );
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient]);

  const handleSort = (key: string) => {
    const sortBy = key as ProblemSortField;
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortDir: prev.sortBy === sortBy && prev.sortDir === "asc" ? "desc" : "asc",
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const columns: Column<Problem>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      cell: (row) => <span className="font-medium hover:text-primary">{row.title}</span>,
    },
    {
      key: "platform",
      header: "Platform",
      sortable: true,
      cell: (row) => <span className="capitalize">{row.platform}</span>,
    },
    {
      key: "difficulty",
      header: "Difficulty",
      sortable: true,
      cell: (row) => <DifficultyBadge difficulty={row.difficulty} />,
    },
    {
      key: "topics",
      header: "Topics",
      cell: (row) => (
        <div className="flex max-w-[200px] flex-wrap gap-1">
          {row.topics.slice(0, 2).map((t) => (
            <TopicChip key={t} topic={t} />
          ))}
        </div>
      ),
    },
    {
      key: "solveTimeMin",
      header: "Time",
      sortable: true,
      cell: (row) => (row.solveTimeMin > 0 ? `${row.solveTimeMin}m` : "—"),
    },
    {
      key: "attempts",
      header: "Attempts",
      sortable: true,
      cell: (row) => row.attempts,
    },
    {
      key: "solvedAt",
      header: "Solved",
      sortable: true,
      cell: (row) => format(parseISO(row.solvedAt), "MMM d, yyyy"),
    },
    {
      key: "favorite",
      header: "",
      cell: (row) => <FavoriteButton problemId={row.id} favorite={row.favorite} />,
    },
    {
      key: "aiNotePreview",
      header: "AI Note",
      cell: (row) => (
        <span className="max-w-[180px] truncate text-muted-foreground">
          {row.aiNotePreview || "—"}
        </span>
      ),
    },
  ];

  const tableRows = problemsData?.data ?? [];
  const totalPages = problemsData?.totalPages ?? 1;
  const showPagination = totalPages > 1;

  const daySummary = useMemo(
    () =>
      buildProblemsDaySummary(
        allProblems,
        pageData.sessions,
        selectedDateKey,
        pageData.summary.upcomingContest,
      ),
    [allProblems, pageData.sessions, pageData.summary.upcomingContest, selectedDateKey],
  );

  const upcoming = daySummary.upcomingContest;
  const selectedDateLabel = format(parseISO(selectedDateKey), "MMM d, yyyy");

  const problemCardTitle = isViewingToday
    ? "Today’s problem"
    : `Problem on ${selectedDateLabel}`;

  const studyCardTitle = isViewingToday
    ? "Study time today"
    : `Study time on ${selectedDateLabel}`;

  const studyLabel =
    daySummary.dayStudyMinutes === 0
      ? isViewingToday
        ? "Log a focused study session"
        : "No study logged that day"
      : isViewingToday
        ? `${daySummary.dayStudyMinutes} min logged today`
        : `${daySummary.dayStudyMinutes} min logged that day`;

  const sectionTitle = isViewingToday
    ? "Solved today"
    : `Solved on ${format(parseISO(selectedDateKey), "MMM d, yyyy")}`;

  const emptyTitle = isViewingToday
    ? "No problems solved today"
    : `No problems on ${format(parseISO(selectedDateKey), "MMM d, yyyy")}`;

  const emptyDescription = isViewingToday
    ? "Solve a problem today and it will appear here."
    : "Try another day or refresh to pull the latest platform data.";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Problems"
        description="Track today’s progress and browse problems from previous days."
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void handleRefresh()}
            disabled={isRefreshing}
          >
            <RefreshCw className={isRefreshing ? "animate-spin" : undefined} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        }
      />

      <SyncBanner sync={problemsData?.sync} upcomingContest={upcoming} />
      {refreshError ? (
        <p className="text-sm text-destructive" role="alert">
          {refreshError}
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title={problemCardTitle}
          value={
            daySummary.dayProblem
              ? daySummary.dayProblem.title
              : isViewingToday
                ? "No problem yet"
                : "No problem that day"
          }
          delta={
            daySummary.dayProblem
              ? `${daySummary.dayProblem.platform} • ${daySummary.dayProblem.difficulty}`
              : ""
          }
          icon={Target}
        />
        <StatCard
          title={studyCardTitle}
          value={`${daySummary.dayStudyMinutes} min`}
          delta={studyLabel}
          positive={daySummary.dayStudyMinutes > 0}
          icon={Timer}
        />
      </section>

      <section className="space-y-4">
        <ProblemsDateNavigator
          selectedDate={selectedDateKey}
          todayKey={todayKey}
          countsByDate={countsByDate}
          onDateChange={handleDateChange}
        />

        <h3 className="text-sm font-medium text-foreground">{sectionTitle}</h3>
        {isLoading ? null : !problemsData || tableRows.length === 0 ? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        ) : (
          <DataTable
            columns={columns}
            data={tableRows}
            sortBy={filters.sortBy}
            sortDir={filters.sortDir}
            onSort={handleSort}
            page={filters.page ?? 1}
            totalPages={totalPages}
            onPageChange={showPagination ? handlePageChange : () => undefined}
            onRowClick={(row) => router.push(`/problems/${row.id}`)}
            getRowKey={(row) => row.id}
          />
        )}
      </section>
    </div>
  );
}
