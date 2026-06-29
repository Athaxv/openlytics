import type { Problem, ProblemDetail } from "@/types/problems";

export function mergeProblems(problems: Problem[]): Problem[] {
  const byId = new Map<string, Problem>();

  for (const problem of problems) {
    const existing = byId.get(problem.id);
    if (!existing || problem.solvedAt > existing.solvedAt) {
      byId.set(problem.id, problem);
    }
  }

  return Array.from(byId.values()).sort((a, b) => b.solvedAt.localeCompare(a.solvedAt));
}

function findRelatedIds(problem: Problem, all: Problem[]): string[] {
  const samePlatform = all.filter(
    (p) => p.platform === problem.platform && p.id !== problem.id,
  );

  const withTopicOverlap = samePlatform.filter((p) =>
    p.topics.some((t) => problem.topics.includes(t)),
  );

  const pool = withTopicOverlap.length > 0 ? withTopicOverlap : samePlatform;

  return pool
    .slice(0, 3)
    .map((p) => p.id);
}

export function toProblemDetail(problem: Problem, allProblems: Problem[]): ProblemDetail {
  const platformLabel = problem.platform.charAt(0).toUpperCase() + problem.platform.slice(1);
  const topicSummary =
    problem.topics.length > 0 ? problem.topics.join(", ") : "general algorithms";

  return {
    ...problem,
    url:
      problem.url ??
      `https://${problem.platform}.com/problems/${problem.title.toLowerCase().replace(/\s+/g, "-")}`,
    description: `Solved on ${platformLabel}. Topics: ${topicSummary}.`,
    aiConcepts:
      problem.topics.length > 0
        ? [`Core pattern: ${problem.topics[0]}`, `Review ${problem.difficulty} problems in this topic`]
        : ["Review similar problems on this platform"],
    mistakes: [],
    revisionHistory: [],
    relatedIds: findRelatedIds(problem, allProblems),
    personalNotes: "",
  };
}

export function buildProblemDetails(problems: Problem[]): ProblemDetail[] {
  return problems.map((p) => toProblemDetail(p, problems));
}
