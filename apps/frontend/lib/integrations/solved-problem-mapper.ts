import type { SolvedProblemRow } from "@repo/db";
import type { Difficulty, Platform, Problem, ProblemDetail } from "@/types/problems";
import { toProblemDetail } from "@/lib/integrations/normalize-problems";

export function solvedRowToProblem(row: SolvedProblemRow): Problem {
  return {
    id: row.id,
    title: row.title,
    platform: row.platform as Platform,
    difficulty: row.difficulty as Difficulty,
    topics: row.topics,
    solveTimeMin: row.solveTimeMin,
    attempts: row.attempts,
    solvedAt: row.solvedAt,
    favorite: row.favorite ?? false,
    aiNotePreview: row.aiNotePreview ?? "",
    source: "live",
    url: row.url,
    submissionId: row.submissionId,
    language: row.language,
  };
}

export function solvedRowsToProblems(rows: SolvedProblemRow[]): Problem[] {
  return rows.map(solvedRowToProblem);
}

export function solvedRowToProblemDetail(
  row: SolvedProblemRow,
  allProblems: Problem[],
): ProblemDetail {
  const base = solvedRowToProblem(row);
  const detail = toProblemDetail(base, allProblems);

  if (row.description) {
    detail.description = row.description;
  }
  if (row.aiConcepts && row.aiConcepts.length > 0) {
    detail.aiConcepts = row.aiConcepts;
  }
  if (row.mistakes && row.mistakes.length > 0) {
    detail.mistakes = row.mistakes;
  }
  if (row.revisionHistory && row.revisionHistory.length > 0) {
    detail.revisionHistory = row.revisionHistory;
  }
  if (row.personalNotes) {
    detail.personalNotes = row.personalNotes;
  }

  return detail;
}
