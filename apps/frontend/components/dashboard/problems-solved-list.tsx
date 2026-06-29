"use client";

import { useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { RefreshCw } from "lucide-react";
import { DataTable, type Column } from "@/components/common/data-table";
import { DifficultyBadge } from "@/components/problems/difficulty-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Platform, Problem } from "@/types/problems";

const PAGE_SIZE = 10;

const platformStyles: Record<Platform, string> = {
  leetcode: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  codeforces: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  atcoder: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  gfg: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  other: "bg-muted text-muted-foreground",
};

type ProblemsSolvedListProps = {
  problems: Problem[];
  onRefresh?: () => Promise<void>;
  isRefreshing?: boolean;
  refreshError?: string | null;
};

export function ProblemsSolvedList({
  problems,
  onRefresh,
  isRefreshing = false,
  refreshError = null,
}: ProblemsSolvedListProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(problems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageData = problems.slice(start, start + PAGE_SIZE);

  const columns: Column<Problem>[] = [
    {
      key: "solvedAt",
      header: "Date",
      cell: (row) => (
        <span className="text-muted-foreground">
          {format(parseISO(row.solvedAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "title",
      header: "Description",
      cell: (row) => (
        <Link
          href={`/problems/${row.id}`}
          className="font-medium text-foreground hover:text-primary hover:underline"
        >
          {row.title}
        </Link>
      ),
    },
    {
      key: "platform",
      header: "Platform",
      cell: (row) => (
        <Badge
          variant="outline"
          className={cn("border-0 font-normal capitalize", platformStyles[row.platform])}
        >
          {row.platform}
        </Badge>
      ),
    },
    {
      key: "difficulty",
      header: "Difficulty",
      cell: (row) => <DifficultyBadge difficulty={row.difficulty} />,
    },
    {
      key: "solveTimeMin",
      header: "Time",
      cell: (row) => (
        <span className="text-muted-foreground">
          {row.solveTimeMin > 0 ? `${row.solveTimeMin}m` : "—"}
        </span>
      ),
    },
  ];

  return (
    <section className="rounded-2xl bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Recent Activity</h3>
          <Badge variant="secondary" className="font-normal">
            {problems.length}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {problems.length > PAGE_SIZE ? (
            <p className="text-xs text-muted-foreground">
              Page {safePage} of {totalPages}
            </p>
          ) : null}
          {onRefresh ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void onRefresh()}
              disabled={isRefreshing}
              aria-label="Refresh recent activity"
            >
              <RefreshCw
                className={cn(isRefreshing && "animate-spin")}
                aria-hidden
              />
              {isRefreshing ? "Refreshing…" : "Refresh"}
            </Button>
          ) : null}
        </div>
      </div>

      {refreshError ? (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {refreshError}
        </p>
      ) : null}

      {problems.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No solved problems yet. Sync your accounts or solve your first problem to see it here.
        </p>
      ) : (
        <div className="mt-4">
          <DataTable
            columns={columns}
            data={pageData}
            page={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
            getRowKey={(row) => row.id}
          />
        </div>
      )}
    </section>
  );
}
