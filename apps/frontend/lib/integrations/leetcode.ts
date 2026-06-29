import type { IntegrationFetchOptions } from "@/lib/integrations/fetch-options";
import { platformFetchInit } from "@/lib/integrations/fetch-options";
import type { Difficulty, Problem } from "@/types/problems";

const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";

type RecentAcSubmission = {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: string;
};

type QuestionMeta = {
  difficulty: string;
  topicTags: { name: string; slug: string }[];
};

async function leetcodeGraphql<T>(
  query: string,
  variables: Record<string, unknown>,
  options?: IntegrationFetchOptions,
): Promise<T> {
  const res = await fetch(LEETCODE_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Openlytics/1.0",
    },
    body: JSON.stringify({ query, variables }),
    ...platformFetchInit(options),
  });

  if (!res.ok) {
    throw new Error(`LeetCode GraphQL HTTP ${res.status}`);
  }

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };

  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "LeetCode GraphQL error");
  }

  if (!json.data) {
    throw new Error("LeetCode GraphQL returned no data");
  }

  return json.data;
}

function lcDifficultyToOurs(difficulty: string): Difficulty {
  const lower = difficulty.toLowerCase();
  if (lower === "easy") return "easy";
  if (lower === "hard") return "hard";
  return "medium";
}

async function fetchRecentAcSubmissions(
  username: string,
  limit: number,
  options?: IntegrationFetchOptions,
): Promise<RecentAcSubmission[]> {
  const data = await leetcodeGraphql<{
    recentAcSubmissionList: RecentAcSubmission[];
  }>(
    `
    query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
      }
    }
  `,
    { username, limit },
    options,
  );

  return data.recentAcSubmissionList ?? [];
}

async function fetchQuestionMeta(
  titleSlug: string,
  options?: IntegrationFetchOptions,
): Promise<QuestionMeta | null> {
  try {
    const data = await leetcodeGraphql<{
      question: QuestionMeta | null;
    }>(
      `
      query questionMeta($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          difficulty
          topicTags { name slug }
        }
      }
    `,
      { titleSlug },
      options,
    );
    return data.question;
  } catch {
    return null;
  }
}

async function fetchQuestionMetaBatch(
  slugs: string[],
  options?: IntegrationFetchOptions,
  batchSize = 10,
): Promise<Map<string, QuestionMeta>> {
  const meta = new Map<string, QuestionMeta>();

  for (let i = 0; i < slugs.length; i += batchSize) {
    const batch = slugs.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (slug) => {
        const question = await fetchQuestionMeta(slug, options);
        return { slug, question };
      }),
    );
    for (const { slug, question } of results) {
      if (question) meta.set(slug, question);
    }
  }

  return meta;
}

export async function fetchLeetcodeProblems(
  username: string,
  limit = 200,
  options?: IntegrationFetchOptions,
): Promise<Problem[]> {
  const submissions = await fetchRecentAcSubmissions(username, limit, options);

  const bySlug = new Map<string, RecentAcSubmission>();
  for (const sub of submissions) {
    const existing = bySlug.get(sub.titleSlug);
    if (!existing || Number(sub.timestamp) > Number(existing.timestamp)) {
      bySlug.set(sub.titleSlug, sub);
    }
  }

  const slugs = Array.from(bySlug.keys());
  const metaMap = await fetchQuestionMetaBatch(slugs, options);

  return slugs.map((slug) => {
    const sub = bySlug.get(slug)!;
    const meta = metaMap.get(slug);
    const timestampSec = Number(sub.timestamp);
    const solvedAt = Number.isFinite(timestampSec)
      ? new Date(timestampSec * 1000).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);

    return {
      id: `lc-${slug}`,
      title: sub.title,
      platform: "leetcode" as const,
      difficulty: meta ? lcDifficultyToOurs(meta.difficulty) : "medium",
      topics: meta?.topicTags.map((t) => t.name) ?? [],
      solveTimeMin: 0,
      attempts: 1,
      solvedAt,
      favorite: false,
      aiNotePreview: "",
      source: "live" as const,
      url: `https://leetcode.com/problems/${slug}/`,
      submissionId: sub.id,
    };
  });
}
