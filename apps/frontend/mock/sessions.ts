import { subDays, formatISO, addMinutes } from "date-fns";
import type { StudySession, SessionPlatform } from "@/types/sessions";

const platforms: SessionPlatform[] = ["leetcode", "codeforces", "atcoder", "gfg", "mixed"];

const notesPool = [
  "Focused on graph BFS patterns.",
  "Warm-up with easy arrays, then one hard DP.",
  "Contest replay — timed 90 minutes.",
  "Revision session for weak topics.",
  "Mixed platform practice before interview.",
  "Deep dive on binary search variants.",
  "Quick 45-min session before work.",
];

const problemSets = [
  ["Two Sum", "Valid Parentheses", "Climbing Stairs"],
  ["3Sum", "Course Schedule", "House Robber"],
  ["Word Ladder", "Serialize and Deserialize Binary Tree"],
  ["Number of Islands", "Pacific Atlantic Water Flow"],
  ["Coin Change", "Longest Increasing Subsequence", "Edit Distance"],
  ["Kth Largest Element in Array", "Top K Frequent Elements"],
  ["Binary Tree Level Order Traversal", "Validate Binary Search Tree"],
  ["Trapping Rain Water", "Minimum Window Substring"],
];

function buildSession(index: number): StudySession {
  const daysAgo = index * 2 + (index % 3);
  const start = subDays(new Date(), daysAgo);
  start.setHours(9 + (index % 8), (index * 15) % 60, 0, 0);
  const durationMin = 30 + (index % 6) * 15;
  const end = addMinutes(start, durationMin);
  const problemsSolved = problemSets[index % problemSets.length]!;

  return {
    id: `sess-${String(index + 1).padStart(3, "0")}`,
    startedAt: start.toISOString(),
    endedAt: end.toISOString(),
    durationMin,
    platform: platforms[index % platforms.length]!,
    problemsSolved,
    productivityScore: 55 + (index % 45),
    notes: notesPool[index % notesPool.length]!,
  };
}

export const sessionsMock: StudySession[] = Array.from({ length: 35 }, (_, i) =>
  buildSession(i),
);

export function getSessionDates(): string[] {
  return sessionsMock.map((s) =>
    formatISO(new Date(s.startedAt), { representation: "date" }),
  );
}
