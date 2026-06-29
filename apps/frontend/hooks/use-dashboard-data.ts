"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/services/dashboard";
import { queryKeys } from "@/lib/query-keys";

export function useDashboardData() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: getDashboardData,
  });
}
