"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { createSession, type CreateSessionPayload } from "@/services/sessions";

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSessionPayload) => createSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
    },
  });
}
