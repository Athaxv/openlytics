"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { toggleFavorite } from "@/services/favorites";
import { updateProblemFavorite } from "@/services/problems";

type ToggleFavoriteInput = {
  problemId: string;
  favorite: boolean;
};

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ problemId }: ToggleFavoriteInput) => toggleFavorite(problemId),
    onMutate: async ({ problemId, favorite }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.problems.all });

      const previousLists = queryClient.getQueriesData({
        queryKey: queryKeys.problems.all,
      });

      const nextFavorite = !favorite;
      updateProblemFavorite(problemId, nextFavorite);

      queryClient.setQueriesData(
        { queryKey: queryKeys.problems.all },
        (old: unknown) => {
          if (!old || typeof old !== "object") return old;

          const data = old as {
            data?: Array<{ id: string; favorite: boolean }>;
            favorite?: boolean;
            id?: string;
          };

          if (Array.isArray(data.data)) {
            return {
              ...data,
              data: data.data.map((problem) =>
                problem.id === problemId
                  ? { ...problem, favorite: nextFavorite }
                  : problem,
              ),
            };
          }

          if (data.id === problemId) {
            return { ...data, favorite: nextFavorite };
          }

          return old;
        },
      );

      return { previousLists, problemId, nextFavorite };
    },
    onError: (_error, { problemId }, context) => {
      if (context?.nextFavorite !== undefined) {
        updateProblemFavorite(problemId, !context.nextFavorite);
      }

      if (context?.previousLists) {
        for (const [key, data] of context.previousLists) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.problems.all });
    },
  });
}
