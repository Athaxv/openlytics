import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getFavoriteIdsForUser } from "@/lib/server/problem-favorites";

export async function getSessionFavoriteIds(): Promise<string[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return [];
    }

    return getFavoriteIdsForUser(session.user.id);
  } catch (error) {
    console.error("[getSessionFavoriteIds] Failed:", error);
    return [];
  }
}
