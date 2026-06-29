import { subDays, formatISO } from "date-fns";
import type { ProblemDetail, Difficulty, Platform, Problem } from "@/types/problems";

const titles: { title: string; topics: string[]; difficulty: Difficulty }[] = [
  { title: "Two Sum", topics: ["Array", "Hash Table"], difficulty: "easy" },
  { title: "Valid Parentheses", topics: ["String", "Stack"], difficulty: "easy" },
  { title: "Merge Two Sorted Lists", topics: ["Linked List", "Sorting"], difficulty: "easy" },
  { title: "Best Time to Buy and Sell Stock", topics: ["Array", "Dynamic Programming"], difficulty: "easy" },
  { title: "Maximum Subarray", topics: ["Array", "Dynamic Programming"], difficulty: "medium" },
  { title: "Product of Array Except Self", topics: ["Array", "Prefix Sum"], difficulty: "medium" },
  { title: "3Sum", topics: ["Array", "Two Pointers"], difficulty: "medium" },
  { title: "Container With Most Water", topics: ["Array", "Two Pointers"], difficulty: "medium" },
  { title: "Longest Substring Without Repeating Characters", topics: ["String", "Hash Table"], difficulty: "medium" },
  { title: "Longest Palindromic Substring", topics: ["String", "Dynamic Programming"], difficulty: "medium" },
  { title: "Trapping Rain Water", topics: ["Array", "Two Pointers"], difficulty: "hard" },
  { title: "Minimum Window Substring", topics: ["String", "Hash Table"], difficulty: "hard" },
  { title: "Binary Tree Inorder Traversal", topics: ["Tree", "Stack"], difficulty: "easy" },
  { title: "Maximum Depth of Binary Tree", topics: ["Tree", "DFS"], difficulty: "easy" },
  { title: "Invert Binary Tree", topics: ["Tree"], difficulty: "easy" },
  { title: "Validate Binary Search Tree", topics: ["Tree", "DFS"], difficulty: "medium" },
  { title: "Lowest Common Ancestor of BST", topics: ["Tree"], difficulty: "medium" },
  { title: "Binary Tree Level Order Traversal", topics: ["Tree", "BFS"], difficulty: "medium" },
  { title: "Serialize and Deserialize Binary Tree", topics: ["Tree", "DFS"], difficulty: "hard" },
  { title: "Word Ladder", topics: ["Graph", "BFS"], difficulty: "hard" },
  { title: "Number of Islands", topics: ["Graph", "DFS"], difficulty: "medium" },
  { title: "Course Schedule", topics: ["Graph", "Topological Sort"], difficulty: "medium" },
  { title: "Clone Graph", topics: ["Graph", "DFS"], difficulty: "medium" },
  { title: "Pacific Atlantic Water Flow", topics: ["Graph", "DFS"], difficulty: "medium" },
  { title: "Network Delay Time", topics: ["Graph", "Heap"], difficulty: "medium" },
  { title: "Cheapest Flights Within K Stops", topics: ["Graph", "Dynamic Programming"], difficulty: "medium" },
  { title: "Climbing Stairs", topics: ["Dynamic Programming"], difficulty: "easy" },
  { title: "House Robber", topics: ["Dynamic Programming"], difficulty: "medium" },
  { title: "Coin Change", topics: ["Dynamic Programming"], difficulty: "medium" },
  { title: "Longest Increasing Subsequence", topics: ["Dynamic Programming", "Binary Search"], difficulty: "medium" },
  { title: "Edit Distance", topics: ["Dynamic Programming", "String"], difficulty: "medium" },
  { title: "Unique Paths", topics: ["Dynamic Programming", "Math"], difficulty: "medium" },
  { title: "Word Break", topics: ["Dynamic Programming", "String"], difficulty: "medium" },
  { title: "Partition Equal Subset Sum", topics: ["Dynamic Programming"], difficulty: "medium" },
  { title: "Regular Expression Matching", topics: ["Dynamic Programming", "String"], difficulty: "hard" },
  { title: "Burst Balloons", topics: ["Dynamic Programming"], difficulty: "hard" },
  { title: "Kth Largest Element in Array", topics: ["Array", "Heap"], difficulty: "medium" },
  { title: "Find Median from Data Stream", topics: ["Heap", "Design"], difficulty: "hard" },
  { title: "Top K Frequent Elements", topics: ["Array", "Heap"], difficulty: "medium" },
  { title: "Merge K Sorted Lists", topics: ["Linked List", "Heap"], difficulty: "hard" },
  { title: "Search in Rotated Sorted Array", topics: ["Array", "Binary Search"], difficulty: "medium" },
  { title: "Find Minimum in Rotated Sorted Array", topics: ["Array", "Binary Search"], difficulty: "medium" },
  { title: "Median of Two Sorted Arrays", topics: ["Array", "Binary Search"], difficulty: "hard" },
  { title: "Subsets", topics: ["Backtracking"], difficulty: "medium" },
  { title: "Permutations", topics: ["Backtracking"], difficulty: "medium" },
  { title: "Combination Sum", topics: ["Backtracking"], difficulty: "medium" },
  { title: "N-Queens", topics: ["Backtracking"], difficulty: "hard" },
  { title: "Jump Game", topics: ["Array", "Greedy"], difficulty: "medium" },
  { title: "Gas Station", topics: ["Array", "Greedy"], difficulty: "medium" },
  { title: "Task Scheduler", topics: ["Array", "Greedy", "Heap"], difficulty: "medium" },
];

const platforms: Platform[] = ["leetcode", "codeforces", "atcoder", "gfg", "leetcode"];

const aiNotes = [
  "Focus on hash map lookup pattern.",
  "Practice two-pointer invariant before revisiting.",
  "Draw the recursion tree to avoid stack overflow.",
  "Memoize overlapping subproblems early.",
  "BFS layer-by-layer is cleaner than DFS here.",
  "Watch edge cases on empty input.",
  "Greedy choice needs proof — don't assume.",
  "Binary search on answer space, not values.",
];

const mistakesPool = [
  "Off-by-one in loop bounds",
  "Forgot to handle duplicate elements",
  "Used O(n²) brute force instead of optimal",
  "Missed base case in recursion",
  "Incorrect pointer movement on equal values",
  "Did not initialize DP table correctly",
];

function buildProblem(index: number): ProblemDetail {
  const spec = titles[index % titles.length]!;
  const platform = platforms[index % platforms.length]!;
  const id = `prob-${String(index + 1).padStart(3, "0")}`;
  const solvedDaysAgo = index * 2 + (index % 5);
  const attempts = (index % 4) + 1;
  const solveTimeMin = 12 + (index % 7) * 8 + (spec.difficulty === "hard" ? 20 : 0);

  const relatedIds = [
    `prob-${String(((index + 3) % 50) + 1).padStart(3, "0")}`,
    `prob-${String(((index + 7) % 50) + 1).padStart(3, "0")}`,
    `prob-${String(((index + 11) % 50) + 1).padStart(3, "0")}`,
  ].filter((rid) => rid !== id);

  return {
    id,
    title: spec.title,
    platform,
    difficulty: spec.difficulty,
    topics: spec.topics,
    solveTimeMin,
    attempts,
    solvedAt: formatISO(subDays(new Date(), solvedDaysAgo), { representation: "date" }),
    favorite: index % 7 === 0,
    aiNotePreview: aiNotes[index % aiNotes.length]!,
    url: `https://${platform}.com/problems/${spec.title.toLowerCase().replace(/\s+/g, "-")}`,
    description: `Practice problem covering ${spec.topics.join(", ")}. Solved after ${attempts} attempt(s) in ${solveTimeMin} minutes.`,
    aiConcepts: [
      `Core pattern: ${spec.topics[0]}`,
      `Difficulty focus: ${spec.difficulty} optimization`,
      "Review similar problems weekly",
    ],
    mistakes: [mistakesPool[index % mistakesPool.length]!],
    revisionHistory: [
      {
        date: formatISO(subDays(new Date(), solvedDaysAgo + 14), { representation: "date" }),
        note: "First revision — re-derived solution from scratch",
      },
      ...(index % 3 === 0
        ? [
            {
              date: formatISO(subDays(new Date(), solvedDaysAgo + 30), { representation: "date" }),
              note: "Second revision — timed attempt under 25 min",
            },
          ]
        : []),
    ],
    relatedIds,
    personalNotes:
      index % 5 === 0
        ? "Need to revisit before interviews — pattern still feels shaky."
        : "",
  };
}

function toProblemSummary(detail: ProblemDetail): Problem {
  return {
    id: detail.id,
    title: detail.title,
    platform: detail.platform,
    difficulty: detail.difficulty,
    topics: detail.topics,
    solveTimeMin: detail.solveTimeMin,
    attempts: detail.attempts,
    solvedAt: detail.solvedAt,
    favorite: detail.favorite,
    aiNotePreview: detail.aiNotePreview,
  };
}

export const problemDetailsMock: ProblemDetail[] = Array.from({ length: 50 }, (_, i) =>
  buildProblem(i),
);

export const problemsMock = problemDetailsMock.map(toProblemSummary);
