import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchProblemsSync } from "@/lib/server/problems-sync";

export async function GET() {
  let userId: string | undefined;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    userId = session.user.id;
  } catch (error) {
    console.error("[problems/sync] Session check failed:", error);
    return NextResponse.json(
      {
        error: "Session check failed",
        message:
          "Could not verify your session (database unavailable). Try refreshing the page.",
      },
      { status: 503 },
    );
  }

  try {
    const data = await fetchProblemsSync(userId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[problems/sync] Platform sync failed:", error);
    return NextResponse.json(
      {
        error: "Sync failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
