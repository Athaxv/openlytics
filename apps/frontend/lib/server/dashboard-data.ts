import { buildDashboardData } from "@/lib/dashboard/aggregate";
import type { IntegrationFetchOptions } from "@/lib/integrations/fetch-options";
import { fetchCodeforcesRating } from "@/lib/integrations/codeforces-rating";
import {
  fetchProblemsSync,
  invalidateProblemsSyncCache,
} from "@/lib/server/problems-sync";
import type { DashboardData } from "@/types/dashboard";

export type DashboardFetchOptions = IntegrationFetchOptions;

export async function fetchDashboardData(
  userId: string,
  options: DashboardFetchOptions = {},
): Promise<DashboardData> {
  if (options.forceRefresh) {
    invalidateProblemsSyncCache(userId);
  }

  const cfHandle = process.env.CODEFORCES_HANDLE?.trim();

  const [{ problems }, cfRating] = await Promise.all([
    fetchProblemsSync(userId, options),
    fetchCodeforcesRating(cfHandle, options),
  ]);

  return buildDashboardData(problems, cfRating);
}
