export type Platform = "leetcode" | "codeforces" | "atcoder" | "gfg" | "other";

export type Difficulty = "easy" | "medium" | "hard";

export type Problem = {
  id: string;
  title: string;
  platform: Platform;
  difficulty: Difficulty;
  topics: string[];
  solveTimeMin: number;
  attempts: number;
  solvedAt: string;
  favorite: boolean;
  aiNotePreview: string;
  source?: "live" | "mock";
  url?: string;
  submissionId?: string;
  language?: string;
};

export type RevisionEntry = {
  date: string;
  note: string;
};

export type ProblemDetail = Problem & {
  url: string;
  description: string;
  aiConcepts: string[];
  mistakes: string[];
  revisionHistory: RevisionEntry[];
  relatedIds: string[];
  personalNotes: string;
};

export type ProblemSortField =
  | "title"
  | "platform"
  | "difficulty"
  | "solveTimeMin"
  | "attempts"
  | "solvedAt";

export type ProblemFilters = {
  search?: string;
  platform?: Platform;
  difficulty?: Difficulty;
  topic?: string;
  solvedDate?: string;
  sortBy?: ProblemSortField;
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export const ALL_TOPICS = [
  "Array",
  "String",
  "Hash Table",
  "Dynamic Programming",
  "Graph",
  "Tree",
  "Binary Search",
  "Two Pointers",
  "Stack",
  "Greedy",
  "Math",
  "Sorting",
  "Heap",
  "Trie",
  "Backtracking",
] as const;

export const ALL_PLATFORMS: Platform[] = [
  "leetcode",
  "codeforces",
  "atcoder",
  "gfg",
  "other",
];

export type PlatformSyncStatus = "ok" | "error" | "skipped";

export type ProblemsSyncMeta = {
  source: "live" | "mock";
  sources: {
    codeforces: PlatformSyncStatus;
    leetcode: PlatformSyncStatus;
  };
  errors?: string[];
  liveCount?: number;
  leetcodeStoredCount?: number;
};

export type ProblemsSyncResult = {
  problems: Problem[];
  details: ProblemDetail[];
  meta: ProblemsSyncMeta;
};

export type ProblemSolution = {
  code: string;
  language: string;
  available: boolean;
  message?: string;
};
