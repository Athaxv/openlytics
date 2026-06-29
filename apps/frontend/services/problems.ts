import type {
  ProblemFilters,
  PaginatedResult,
  Problem,
  ProblemDetail,
  ProblemSortField,
  ProblemsSyncMeta,
  ProblemsSyncResult,
} from "@/types/problems";
import type { ProblemsPageData } from "@/types/problems-page";
import { problemDetailsMock, problemsMock } from "@/mock/problems";

const difficultyOrder = { easy: 0, medium: 1, hard: 2 };

let cachedProblems: Problem[] | null = null;
let cachedDetails: Map<string, ProblemDetail> | null = null;
let cachedSyncMeta: ProblemsSyncMeta | null = null;
let loadPromise: Promise<void> | null = null;

export function seedProblemsCache(data: ProblemsSyncResult): void {
  cachedProblems = data.problems;
  cachedDetails = new Map(data.details.map((p) => [p.id, p]));
  cachedSyncMeta = data.meta;
  loadPromise = Promise.resolve();
}

export async function refreshProblemsPageData(): Promise<ProblemsPageData> {
  const res = await fetch("/api/problems/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      message?: string;
      error?: string;
    } | null;
    throw new Error(body?.message ?? body?.error ?? `Refresh failed: ${res.status}`);
  }

  const data = (await res.json()) as ProblemsPageData;
  seedProblemsCache(data.initialSync);
  return data;
}

export function getCachedProblems(): Problem[] {
  return cachedProblems ?? problemsMock;
}

export function updateProblemFavorite(problemId: string, favorite: boolean): void {
  if (cachedProblems) {
    cachedProblems = cachedProblems.map((problem) =>
      problem.id === problemId ? { ...problem, favorite } : problem,
    );
  }

  if (cachedDetails?.has(problemId)) {
    const detail = cachedDetails.get(problemId)!;
    cachedDetails.set(problemId, { ...detail, favorite });
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureLoaded(): Promise<void> {
  if (cachedProblems !== null) return;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";

    if (useMock) {
      seedProblemsCache({
        problems: problemsMock,
        details: problemDetailsMock,
        meta: {
          source: "mock",
          sources: { codeforces: "skipped", leetcode: "skipped" },
        },
      });
      return;
    }

    try {
      const res = await fetch("/api/problems/sync", { credentials: "include" });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          message?: string;
          error?: string;
        } | null;
        throw new Error(body?.message ?? body?.error ?? `Sync failed: ${res.status}`);
      }

      const data = (await res.json()) as ProblemsSyncResult;
      seedProblemsCache(data);
    } catch (error) {
      cachedProblems = problemsMock;
      cachedDetails = new Map(problemDetailsMock.map((p) => [p.id, p]));
      cachedSyncMeta = {
        source: "mock",
        sources: { codeforces: "error", leetcode: "error" },
        errors: [
          error instanceof Error
            ? error.message
            : "Failed to sync platform data. Showing mock problems.",
        ],
      };
      loadPromise = Promise.resolve();
    }
  })();

  await loadPromise;
}

function sortProblems(
  items: Problem[],
  sortBy: ProblemSortField = "solvedAt",
  sortDir: "asc" | "desc" = "desc",
): Problem[] {
  const sorted = [...items].sort((a, b) => {
    let cmp = 0;
    switch (sortBy) {
      case "title":
        cmp = a.title.localeCompare(b.title);
        break;
      case "platform":
        cmp = a.platform.localeCompare(b.platform);
        break;
      case "difficulty":
        cmp = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        break;
      case "solveTimeMin":
        cmp = a.solveTimeMin - b.solveTimeMin;
        break;
      case "attempts":
        cmp = a.attempts - b.attempts;
        break;
      case "solvedAt":
        cmp = a.solvedAt.localeCompare(b.solvedAt);
        break;
    }
    return sortDir === "asc" ? cmp : -cmp;
  });
  return sorted;
}

export type ProblemsListResult = PaginatedResult<Problem> & {
  sync?: ProblemsSyncMeta;
};

export async function getProblems(
  filters: ProblemFilters = {},
): Promise<ProblemsListResult> {
  await delay(100);
  await ensureLoaded();

  const allProblems = cachedProblems ?? problemsMock;

  const {
    search = "",
    platform,
    difficulty,
    topic,
    solvedDate,
    sortBy = "solvedAt",
    sortDir = "desc",
    page = 1,
    pageSize = 10,
  } = filters;

  let filtered = allProblems;

  if (solvedDate) {
    filtered = filtered.filter((p) => p.solvedAt === solvedDate);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.topics.some((t) => t.toLowerCase().includes(q)) ||
        p.aiNotePreview.toLowerCase().includes(q),
    );
  }

  if (platform) {
    filtered = filtered.filter((p) => p.platform === platform);
  }

  if (difficulty) {
    filtered = filtered.filter((p) => p.difficulty === difficulty);
  }

  if (topic) {
    filtered = filtered.filter((p) =>
      p.topics.some((t) => t.toLowerCase() === topic.toLowerCase()),
    );
  }

  const sorted = sortProblems(filtered, sortBy, sortDir);
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    data: sorted.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
    sync: cachedSyncMeta ?? undefined,
  };
}

export async function getProblemById(id: string): Promise<ProblemDetail> {
  await delay(100);
  await ensureLoaded();

  const detail = cachedDetails?.get(id);
  if (detail) return detail;

  const mockDetail = problemDetailsMock.find((p) => p.id === id);
  if (mockDetail) return mockDetail;

  throw new Error("Problem not found");
}

export async function getRelatedProblems(ids: string[]): Promise<Problem[]> {
  await ensureLoaded();
  const all = cachedProblems ?? problemsMock;
  return all.filter((p) => ids.includes(p.id));
}

export function getSyncMeta(): ProblemsSyncMeta | null {
  return cachedSyncMeta;
}
