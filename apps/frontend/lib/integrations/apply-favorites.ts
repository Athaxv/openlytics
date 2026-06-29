import type { ProblemsSyncResult } from "@/types/problems";

export function applyFavoritesToSync(
  sync: ProblemsSyncResult,
  favoriteIds: string[],
): ProblemsSyncResult {
  if (favoriteIds.length === 0) {
    return sync;
  }

  const favoriteSet = new Set(favoriteIds);

  return {
    ...sync,
    problems: sync.problems.map((problem) => ({
      ...problem,
      favorite: favoriteSet.has(problem.id),
    })),
    details: sync.details.map((detail) => ({
      ...detail,
      favorite: favoriteSet.has(detail.id),
    })),
  };
}
