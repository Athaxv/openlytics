import { fetchCodeforcesProblems } from "@/lib/integrations/codeforces";
import type { IntegrationFetchOptions } from "@/lib/integrations/fetch-options";
import {
  buildProblemDetails,
  mergeProblems,
} from "@/lib/integrations/normalize-problems";
import { syncLeetcodeProblemsForUser } from "@/lib/server/leetcode-sync";
import { problemDetailsMock, problemsMock } from "@/mock/problems";
import type { Problem, ProblemsSyncMeta, ProblemsSyncResult } from "@/types/problems";

const CACHE_TTL_MS = 5 * 60 * 1000;

const cacheByUser = new Map<string, { data: ProblemsSyncResult; expiresAt: number }>();

export type ProblemsSyncOptions = IntegrationFetchOptions;

export async function fetchProblemsSync(
  userId: string,
  options: ProblemsSyncOptions = {},
): Promise<ProblemsSyncResult> {
  const now = Date.now();
  const cached = cacheByUser.get(userId);
  if (!options.forceRefresh && cached && cached.expiresAt > now) {
    return cached.data;
  }

  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";
  const cfHandle = process.env.CODEFORCES_HANDLE?.trim();
  const lcUsername = process.env.LEETCODE_USERNAME?.trim();

  if (useMock || (!cfHandle && !lcUsername)) {
    const data: ProblemsSyncResult = {
      problems: problemsMock,
      details: problemDetailsMock,
      meta: {
        source: "mock",
        sources: {
          codeforces: "skipped",
          leetcode: "skipped",
        },
      },
    };
    cacheByUser.set(userId, { data, expiresAt: now + CACHE_TTL_MS });
    return data;
  }

  const errors: string[] = [];
  const sources: ProblemsSyncMeta["sources"] = {
    codeforces: cfHandle ? "error" : "skipped",
    leetcode: lcUsername ? "error" : "skipped",
  };
  let leetcodeStoredCount: number | undefined;

  const [cfResult, lcResult] = await Promise.allSettled([
    cfHandle
      ? fetchCodeforcesProblems(cfHandle, options)
      : Promise.resolve<Problem[]>([]),
    lcUsername
      ? syncLeetcodeProblemsForUser(userId, lcUsername, options)
      : Promise.resolve(null),
  ]);

  const collected: Problem[] = [];

  if (cfHandle) {
    if (cfResult.status === "fulfilled") {
      sources.codeforces = "ok";
      collected.push(...cfResult.value);
    } else {
      errors.push(
        `Codeforces: ${cfResult.reason instanceof Error ? cfResult.reason.message : "fetch failed"}`,
      );
    }
  }

  if (lcUsername) {
    if (lcResult.status === "fulfilled" && lcResult.value) {
      const lcSync = lcResult.value;
      leetcodeStoredCount = lcSync.storedCount;
      if (lcSync.apiOk) {
        sources.leetcode = "ok";
      } else {
        sources.leetcode = lcSync.problems.length > 0 ? "ok" : "error";
        if (lcSync.error) {
          errors.push(`LeetCode: ${lcSync.error}`);
        }
      }
      collected.push(...lcSync.problems);
    } else {
      errors.push(
        `LeetCode: ${lcResult.status === "rejected" && lcResult.reason instanceof Error ? lcResult.reason.message : "fetch failed"}`,
      );
    }
  }

  const merged = mergeProblems(collected);

  if (merged.length === 0) {
    const data: ProblemsSyncResult = {
      problems: problemsMock,
      details: problemDetailsMock,
      meta: {
        source: "mock",
        sources,
        errors: errors.length > 0 ? errors : ["No problems returned from platforms"],
        liveCount: 0,
        leetcodeStoredCount,
      },
    };
    cacheByUser.set(userId, { data, expiresAt: now + CACHE_TTL_MS });
    return data;
  }

  const details = buildProblemDetails(merged);
  const data: ProblemsSyncResult = {
    problems: merged,
    details,
    meta: {
      source: "live",
      sources,
      errors: errors.length > 0 ? errors : undefined,
      liveCount: merged.length,
      leetcodeStoredCount,
    },
  };

  cacheByUser.set(userId, { data, expiresAt: now + CACHE_TTL_MS });
  return data;
}

export function invalidateProblemsSyncCache(userId?: string) {
  if (userId) {
    cacheByUser.delete(userId);
    return;
  }
  cacheByUser.clear();
}

export async function getProblemDetailFromSync(id: string, userId: string) {
  const sync = await fetchProblemsSync(userId);
  return sync.details.find((p) => p.id === id) ?? null;
}
