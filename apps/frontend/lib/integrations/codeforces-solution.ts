import type { ProblemSolution } from "@/types/problems";

type SubmitSourceResponse = {
  source?: string;
  error?: string;
};

export async function fetchCodeforcesSolution(
  submissionId: string,
): Promise<ProblemSolution> {
  const url = `https://codeforces.com/data/submitSource?submissionId=${encodeURIComponent(submissionId)}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Openlytics/1.0",
      Accept: "application/json, text/plain, */*",
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return {
      code: "",
      language: "Unknown",
      available: false,
      message: `Could not fetch source (HTTP ${res.status}). View on Codeforces instead.`,
    };
  }

  const text = await res.text();

  try {
    const data = JSON.parse(text) as SubmitSourceResponse;

    if (data.source) {
      return {
        code: data.source,
        language: "Codeforces",
        available: true,
      };
    }

    return {
      code: "",
      language: "Unknown",
      available: false,
      message:
        data.error ??
        "Source code is not public for this submission. Open it on Codeforces to view.",
    };
  } catch {
    return {
      code: "",
      language: "Unknown",
      available: false,
      message: "Could not parse Codeforces source response.",
    };
  }
}
