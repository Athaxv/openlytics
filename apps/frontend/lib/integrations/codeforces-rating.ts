import type { IntegrationFetchOptions } from "@/lib/integrations/fetch-options";
import { platformFetchInit } from "@/lib/integrations/fetch-options";
import type { CodeforcesRatingSummary, RatingPoint } from "@/types/dashboard";

type CodeforcesUserInfo = {
  rating?: number;
  maxRating?: number;
  rank?: string;
};

type CodeforcesRatingEntry = {
  contestName: string;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
};

type CodeforcesApiResponse<T> = {
  status: string;
  comment?: string;
  result?: T;
};

export const EMPTY_CODEFORCES_RATING: CodeforcesRatingSummary = {
  currentRating: null,
  maxRating: null,
  rank: null,
  history: [],
};

function formatRatingDate(seconds: number): string {
  return new Date(seconds * 1000).toISOString().slice(0, 10);
}

function mapRatingHistory(entries: CodeforcesRatingEntry[]): RatingPoint[] {
  return entries
    .map((entry) => ({
      date: formatRatingDate(entry.ratingUpdateTimeSeconds),
      rating: entry.newRating,
      oldRating: entry.oldRating,
      delta: entry.newRating - entry.oldRating,
      contestName: entry.contestName,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

async function fetchCodeforcesApi<T>(
  path: string,
  options?: IntegrationFetchOptions,
): Promise<T> {
  const res = await fetch(
    `https://codeforces.com/api/${path}`,
    platformFetchInit(options),
  );

  if (!res.ok) {
    throw new Error(`Codeforces API HTTP ${res.status}`);
  }

  const data = (await res.json()) as CodeforcesApiResponse<T>;

  if (data.status !== "OK" || data.result === undefined) {
    throw new Error(data.comment ?? "Codeforces API returned an error");
  }

  return data.result;
}

export async function fetchCodeforcesRating(
  handle?: string,
  options?: IntegrationFetchOptions,
): Promise<CodeforcesRatingSummary> {
  const trimmed = handle?.trim();
  if (!trimmed) {
    return EMPTY_CODEFORCES_RATING;
  }

  try {
    const [infoList, history] = await Promise.all([
      fetchCodeforcesApi<CodeforcesUserInfo[]>(
        `user.info?handles=${encodeURIComponent(trimmed)}`,
        options,
      ),
      fetchCodeforcesApi<CodeforcesRatingEntry[]>(
        `user.rating?handle=${encodeURIComponent(trimmed)}`,
        options,
      ),
    ]);

    const info = infoList[0];

    return {
      currentRating: info?.rating ?? null,
      maxRating: info?.maxRating ?? null,
      rank: info?.rank ?? null,
      history: mapRatingHistory(history),
    };
  } catch (error) {
    console.error("[fetchCodeforcesRating] Failed:", error);
    return EMPTY_CODEFORCES_RATING;
  }
}
