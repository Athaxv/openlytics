import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { toggleFavorite } from "@/lib/server/problem-favorites";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  let session;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("[problems/favorite] Session check failed:", error);
    return NextResponse.json(
      { error: "Session check failed" },
      { status: 503 },
    );
  }

  const { id } = await context.params;

  try {
    const result = await toggleFavorite(session.user.id, id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[problems/favorite] Toggle failed:", error);
    return NextResponse.json(
      {
        error: "Failed to toggle favorite",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
