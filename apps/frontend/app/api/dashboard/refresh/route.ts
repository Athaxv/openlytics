import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchDashboardData } from "@/lib/server/dashboard-data";

export async function POST() {
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
    console.error("[dashboard/refresh] Session check failed:", error);
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
    const data = await fetchDashboardData(userId, { forceRefresh: true });
    return NextResponse.json(data);
  } catch (error) {
    console.error("[dashboard/refresh] Fetch failed:", error);
    return NextResponse.json(
      {
        error: "Refresh failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
