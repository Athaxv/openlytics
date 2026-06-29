"use client";

import { useQuery } from "@tanstack/react-query";
import { getProblems } from "@/services/problems";
import { queryKeys } from "@/lib/query-keys";
import type { ProblemFilters } from "@/types/problems";

export function useProblems(filters: ProblemFilters = {}) {
  return useQuery({
    queryKey: queryKeys.problems.list(filters),
    queryFn: () => getProblems(filters),
    staleTime: 5 * 60 * 1000,
  });
}
