import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { proposeDiscover } from "@/lib/discover/propose";
import type { DiscoverAxis } from "@/lib/discover/types";

export async function POST(req: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as {
      axis?: DiscoverAxis;
      topic?: string;
      notes?: string;
    };
    if (body.axis !== "trends" && body.axis !== "research") {
      return NextResponse.json({ error: "axis must be trends|research" }, { status: 400 });
    }
    const result = await proposeDiscover({
      axis: body.axis,
      topic: body.topic,
      notes: body.notes,
    });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Propose failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
