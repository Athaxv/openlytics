import { platformFetchInit, type IntegrationFetchOptions } from "@/lib/integrations/fetch-options";
import type { UpcomingContest } from "@/types/problems-page";

type CodeforcesContest = {
  id: number;
  name: string;
  startTimeSeconds: number;
  durationSeconds: number;
  phase: string;
};

type CodeforcesContestResponse = {
  status: string;
  comment?: string;
  result?: CodeforcesContest[];
};

export async function fetchUpcomingContests(
  options?: IntegrationFetchOptions,
): Promise<UpcomingContest | null> {
  const res = await fetch(
    "https://codeforces.com/api/contest.list?gym=false",
    platformFetchInit(options),
  );

  if (!res.ok) {
    console.error("[fetchUpcomingContests] HTTP", res.status);
    return null;
  }

  const data = (await res.json()) as CodeforcesContestResponse;
  if (data.status !== "OK" || !data.result) {
    console.error("[fetchUpcomingContests] API error:", data.comment);
    return null;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const upcoming = data.result
    .filter((contest) => contest.phase === "BEFORE" && contest.startTimeSeconds > nowSeconds)
    .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds)[0];

  if (!upcoming) {
    return null;
  }

  return {
    source: "codeforces",
    name: upcoming.name,
    startTime: new Date(upcoming.startTimeSeconds * 1000).toISOString(),
    durationSeconds: upcoming.durationSeconds,
    url: `https://codeforces.com/contests/${upcoming.id}`,
  };
}

