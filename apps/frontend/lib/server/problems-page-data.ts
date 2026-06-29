import { applyFavoritesToSync } from "@/lib/integrations/apply-favorites";
import { fetchUpcomingContests } from "@/lib/integrations/contests";
import type { IntegrationFetchOptions } from "@/lib/integrations/fetch-options";
import { buildProblemsTodaySummary } from "@/lib/problems/aggregate";
import { getFavoriteIdsForUser } from "@/lib/server/problem-favorites";
import { fetchProblemsSync, invalidateProblemsSyncCache } from "@/lib/server/problems-sync";
import { getStudySessionsForUser } from "@/lib/server/study-sessions";
import type { ProblemsPageData } from "@/types/problems-page";

export async function fetchProblemsPageData(
  userId: string,
  options: IntegrationFetchOptions = {},
): Promise<ProblemsPageData> {
  if (options.forceRefresh) {
    invalidateProblemsSyncCache(userId);
  }

  const [sync, favoriteIds, sessions, upcomingContest] = await Promise.all([
    fetchProblemsSync(userId, options),
    getFavoriteIdsForUser(userId),
    getStudySessionsForUser(userId),
    fetchUpcomingContests(options),
  ]);

  const initialSync = applyFavoritesToSync(sync, favoriteIds);
  const summary = buildProblemsTodaySummary(initialSync.problems, sessions, upcomingContest);

  return {
    initialSync,
    summary,
    sessions,
  };
}
