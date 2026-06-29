"use client";

import { useQuery } from "@tanstack/react-query";
import { getRelatedProblems } from "@/services/problems";
import { queryKeys } from "@/lib/query-keys";

export function useRelatedProblems(ids: string[]) {
  return useQuery({
    queryKey: queryKeys.problems.related(ids),
    queryFn: () => getRelatedProblems(ids),
    enabled: ids.length > 0,
  });
}
