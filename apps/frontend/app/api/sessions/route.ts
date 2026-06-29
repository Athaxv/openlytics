import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getStudySessionsForUser,
  saveStudySessionForUser,
} from "@/lib/server/study-sessions";

export async function GET() {
  let session;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("[sessions] Session check failed:", error);
    return NextResponse.json({ error: "Session check failed" }, { status: 503 });
  }

  try {
    const sessions = await getStudySessionsForUser(session.user.id);
    return NextResponse.json(sessions);
  } catch (error) {
    console.error("[sessions] List failed:", error);
    return NextResponse.json(
      {
        error: "Failed to load sessions",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let session;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("[sessions] Session check failed:", error);
    return NextResponse.json({ error: "Session check failed" }, { status: 503 });
  }

  try {
    const body = (await request.json()) as {
      startedAt?: string;
      endedAt?: string;
      durationMin?: number;
    };

    if (!body.startedAt || !body.endedAt || body.durationMin == null) {
      return NextResponse.json(
        { error: "startedAt, endedAt, and durationMin are required" },
        { status: 400 },
      );
    }

    const created = await saveStudySessionForUser(session.user.id, {
      startedAt: body.startedAt,
      endedAt: body.endedAt,
      durationMin: body.durationMin,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[sessions] Create failed:", error);
    return NextResponse.json(
      {
        error: "Failed to save session",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
