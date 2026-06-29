export async function toggleFavorite(problemId: string): Promise<{ favorite: boolean }> {
  const res = await fetch(`/api/problems/${problemId}/favorite`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      message?: string;
      error?: string;
    } | null;
    throw new Error(body?.message ?? body?.error ?? `Failed to toggle favorite (${res.status})`);
  }

  return res.json() as Promise<{ favorite: boolean }>;
}
