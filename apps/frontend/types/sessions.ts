export type SessionPlatform = "leetcode" | "codeforces" | "atcoder" | "gfg" | "mixed";

export type StudySession = {
  id: string;
  startedAt: string;
  endedAt: string;
  durationMin: number;
  platform: SessionPlatform;
  problemsSolved: string[];
  productivityScore: number;
  notes: string;
};
