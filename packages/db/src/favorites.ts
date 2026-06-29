import { and, eq } from "drizzle-orm";
import { db } from "./client";
import { problemFavorite } from "./db/schema";

export async function getFavoriteIdsForUser(userId: string): Promise<string[]> {
  const rows = await db
    .select({ problemId: problemFavorite.problemId })
    .from(problemFavorite)
    .where(eq(problemFavorite.userId, userId));

  return rows.map((row) => row.problemId);
}

export async function toggleProblemFavorite(
  userId: string,
  problemId: string,
): Promise<{ favorite: boolean }> {
  const existing = await db
    .select({ problemId: problemFavorite.problemId })
    .from(problemFavorite)
    .where(
      and(
        eq(problemFavorite.userId, userId),
        eq(problemFavorite.problemId, problemId),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(problemFavorite)
      .where(
        and(
          eq(problemFavorite.userId, userId),
          eq(problemFavorite.problemId, problemId),
        ),
      );
    return { favorite: false };
  }

  await db.insert(problemFavorite).values({
    userId,
    problemId,
    createdAt: new Date(),
  });

  return { favorite: true };
}
