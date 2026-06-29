"use client";

import { useQuery } from "@tanstack/react-query";
import { getSessions } from "@/services/sessions";
import { queryKeys } from "@/lib/query-keys";

export function useSessions() {
  return useQuery({
    queryKey: queryKeys.sessions.all,
    queryFn: getSessions,
  });
}
