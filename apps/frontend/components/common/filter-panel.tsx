"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_PLATFORMS } from "@/types/problems";
import type { Difficulty, Platform, ProblemFilters } from "@/types/problems";

const difficulties: Difficulty[] = ["easy", "medium", "hard"];

const topics = [
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
];

type FilterPanelProps = {
  filters: ProblemFilters;
  onChange: (filters: ProblemFilters) => void;
};

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const update = (patch: Partial<ProblemFilters>) => {
    onChange({ ...filters, ...patch, page: 1 });
  };

  const hasFilters =
    filters.platform || filters.difficulty || filters.topic || filters.search;

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="min-w-[200px] flex-1">
        <label className="mb-1.5 block text-xs text-muted-foreground">Search</label>
        <Input
          placeholder="Search problems..."
          value={filters.search ?? ""}
          onChange={(e) => update({ search: e.target.value })}
        />
      </div>

      <div className="w-[140px]">
        <label className="mb-1.5 block text-xs text-muted-foreground">Platform</label>
        <Select
          value={filters.platform ?? ""}
          onValueChange={(v) => update({ platform: (v as Platform) || undefined })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {ALL_PLATFORMS.map((p) => (
              <SelectItem key={p} value={p} className="capitalize">
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-[130px]">
        <label className="mb-1.5 block text-xs text-muted-foreground">Difficulty</label>
        <Select
          value={filters.difficulty ?? ""}
          onValueChange={(v) => update({ difficulty: (v as Difficulty) || undefined })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {difficulties.map((d) => (
              <SelectItem key={d} value={d} className="capitalize">
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-[160px]">
        <label className="mb-1.5 block text-xs text-muted-foreground">Topic</label>
        <Select
          value={filters.topic ?? ""}
          onValueChange={(v) => update({ topic: v || undefined })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {topics.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange({
              page: 1,
              pageSize: filters.pageSize,
              sortBy: filters.sortBy,
              sortDir: filters.sortDir,
            })
          }
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
