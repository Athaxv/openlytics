import type { ProblemFilters } from "@/types/problems";

export const queryKeys = {
  dashboard: ["dashboard"] as const,
  problems: {
    all: ["problems"] as const,
    sync: ["problems", "sync"] as const,
    list: (filters: ProblemFilters) => ["problems", "list", filters] as const,
    detail: (id: string) => ["problems", "detail", id] as const,
    solution: (id: string) => ["problems", "solution", id] as const,
    related: (ids: string[]) => ["problems", "related", ids] as const,
  },
  sessions: {
    all: ["sessions"] as const,
  },
};
