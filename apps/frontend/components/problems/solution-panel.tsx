"use client";

import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProblemSolution } from "@/hooks/use-problem-solution";
import type { ProblemDetail } from "@/types/problems";

type SolutionPanelProps = {
  problem: ProblemDetail;
};

export function SolutionPanel({ problem }: SolutionPanelProps) {
  const canFetch =
    problem.source === "live" && Boolean(problem.submissionId);

  const { data, isLoading, isError, error } = useProblemSolution(problem.id, {
    enabled: canFetch,
  });

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-muted-foreground">Your Solution</h3>
        {data?.available && data.language && (
          <Badge variant="outline" className="font-normal">
            {data.language}
          </Badge>
        )}
        {!canFetch && problem.language && (
          <Badge variant="outline" className="font-normal">
            {problem.language}
          </Badge>
        )}
      </div>

      {!canFetch ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No submitted solution for mock data.
        </p>
      ) : isLoading ? (
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : isError ? (
        <p className="mt-4 text-sm text-rose-400">
          {error instanceof Error ? error.message : "Failed to load solution."}
        </p>
      ) : data?.available ? (
        <pre className="mt-4 max-h-[32rem] overflow-auto rounded-md border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
          {data.code}
        </pre>
      ) : (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            {data?.message ??
              "Solution code is not available. It may be private on the platform."}
          </p>
          <a
            href={problem.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <ExternalLink size={14} />
            View on {problem.platform}
          </a>
        </div>
      )}
    </section>
  );
}
