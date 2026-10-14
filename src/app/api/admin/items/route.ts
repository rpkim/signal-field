import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { listResearchFromDb, listTrendsFromDb } from "@/lib/db";
import { removeAddition } from "@/lib/discover/store";
import type { DiscoverAxis } from "@/lib/discover/types";

export async function GET(req: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const axis = new URL(req.url).searchParams.get("axis") as DiscoverAxis | null;
  if (axis === "research") {
    return NextResponse.json({ items: listResearchFromDb() });
  }
  if (axis === "trends") {
    return NextResponse.json({ items: listTrendsFromDb() });
  }
  return NextResponse.json({
    research: listResearchFromDb(),
    trends: listTrendsFromDb(),
  });
}

export async function DELETE(req: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as { axis?: DiscoverAxis; id?: string };
    if (
      (body.axis !== "research" && body.axis !== "trends") ||
      !body.id
    ) {
      return NextResponse.json(
        { error: "axis and id required" },
        { status: 400 }
      );
    }
    const ok = await removeAddition(body.axis, body.id);
    return NextResponse.json({ ok });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
