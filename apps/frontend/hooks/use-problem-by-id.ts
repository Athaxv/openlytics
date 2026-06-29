"use client";

import { useQuery } from "@tanstack/react-query";
import { getProblemById } from "@/services/problems";
import { queryKeys } from "@/lib/query-keys";

export function useProblemById(id: string) {
  return useQuery({
    queryKey: queryKeys.problems.detail(id),
    queryFn: () => getProblemById(id),
    enabled: Boolean(id),
  });
}
