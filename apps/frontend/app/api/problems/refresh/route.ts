import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchProblemsPageData } from "@/lib/server/problems-page-data";

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await fetchProblemsPageData(session.user.id, { forceRefresh: true });
    return NextResponse.json(data);
  } catch (error) {
    console.error("[problems/refresh] Failed:", error);
    return NextResponse.json(
      {
        error: "Refresh failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
