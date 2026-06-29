"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import type { ProblemSolution } from "@/types/problems";

async function fetchProblemSolution(problemId: string): Promise<ProblemSolution> {
  const res = await fetch(`/api/problems/${problemId}/solution`, {
    credentials: "include",
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      message?: string;
      error?: string;
    } | null;
    throw new Error(body?.message ?? body?.error ?? `Failed to load solution (${res.status})`);
  }

  return res.json() as Promise<ProblemSolution>;
}

type UseProblemSolutionOptions = {
  enabled?: boolean;
};

export function useProblemSolution(
  problemId: string,
  options: UseProblemSolutionOptions = {},
) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: queryKeys.problems.solution(problemId),
    queryFn: () => fetchProblemSolution(problemId),
    enabled: enabled && Boolean(problemId),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
