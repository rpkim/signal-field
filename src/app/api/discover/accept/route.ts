import { NextResponse } from "next/server";
import { appendAddition } from "@/lib/discover/store";
import type {
  DiscoverAxis,
  ResearchCandidate,
  TrendCandidate,
} from "@/lib/discover/types";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      axis?: DiscoverAxis;
      item?: TrendCandidate | ResearchCandidate;
    };
    if (body.axis !== "trends" && body.axis !== "research") {
      return NextResponse.json({ error: "axis must be trends|research" }, { status: 400 });
    }
    if (!body.item || typeof body.item !== "object" || !("id" in body.item)) {
      return NextResponse.json({ error: "item required" }, { status: 400 });
    }
    if (body.axis === "trends") {
      const items = await appendAddition("trends", body.item as TrendCandidate);
      return NextResponse.json({ ok: true, items });
    }
    const items = await appendAddition(
      "research",
      body.item as ResearchCandidate
    );
    return NextResponse.json({ ok: true, items });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Accept failed";
    const status = message.includes("already exists") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
