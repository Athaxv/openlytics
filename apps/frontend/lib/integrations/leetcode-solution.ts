import type { ProblemSolution } from "@/types/problems";

const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";

type SubmissionDetails = {
  code: string;
  lang: { name: string } | null;
};

export async function fetchLeetcodeSolution(
  submissionId: string,
): Promise<ProblemSolution> {
  const res = await fetch(LEETCODE_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Openlytics/1.0",
    },
    body: JSON.stringify({
      query: `
        query submissionDetails($submissionId: Int!) {
          submissionDetails(submissionId: $submissionId) {
            code
            lang { name }
          }
        }
      `,
      variables: { submissionId: Number(submissionId) },
    }),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`LeetCode GraphQL HTTP ${res.status}`);
  }

  const json = (await res.json()) as {
    data?: { submissionDetails: SubmissionDetails | null };
    errors?: { message: string }[];
  };

  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "LeetCode GraphQL error");
  }

  const details = json.data?.submissionDetails;
  if (!details?.code) {
    return {
      code: "",
      language: details?.lang?.name ?? "Unknown",
      available: false,
      message: "Solution code is not available for this submission.",
    };
  }

  return {
    code: details.code,
    language: details.lang?.name ?? "Unknown",
    available: true,
  };
}
