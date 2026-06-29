import {
  getSolvedProblemsForUser,
  upsertLeetcodeProblems,
} from "@repo/db";
import type { IntegrationFetchOptions } from "@/lib/integrations/fetch-options";
import { fetchLeetcodeProblems } from "@/lib/integrations/leetcode";
import { solvedRowsToProblems } from "@/lib/integrations/solved-problem-mapper";
import type { Problem } from "@/types/problems";

export type LeetcodeSyncResult = {
  problems: Problem[];
  storedCount: number;
  apiOk: boolean;
  error?: string;
};

export async function syncLeetcodeProblemsForUser(
  userId: string,
  username: string,
  options?: IntegrationFetchOptions,
): Promise<LeetcodeSyncResult> {
  try {
    const fetched = await fetchLeetcodeProblems(username, 200, options);
    await upsertLeetcodeProblems(userId, fetched);
    const rows = await getSolvedProblemsForUser(userId, "leetcode");
    return {
      problems: solvedRowsToProblems(rows),
      storedCount: rows.length,
      apiOk: true,
    };
  } catch (error) {
    const rows = await getSolvedProblemsForUser(userId, "leetcode");
    return {
      problems: solvedRowsToProblems(rows),
      storedCount: rows.length,
      apiOk: false,
      error: error instanceof Error ? error.message : "LeetCode fetch failed",
    };
  }
}
