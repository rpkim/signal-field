import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { allCatalogIds } from "@/lib/db";
import { proposeDiscover } from "@/lib/discover/propose";
import { appendAddition } from "@/lib/discover/store";
import type {
  DiscoverAxis,
  ResearchCandidate,
  TrendCandidate,
} from "@/lib/discover/types";

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
      return NextResponse.json(
        { error: "axis must be trends|research" },
        { status: 400 }
      );
    }

    const proposed = await proposeDiscover({
      axis: body.axis,
      topic: body.topic,
      notes: body.notes,
    });

    const existingIds = allCatalogIds(body.axis);
    const added: Array<{ id: string; label: string }> = [];
    const skipped: Array<{ id: string; reason: string }> = [];

    for (const item of proposed.candidates || []) {
      if (existingIds.has(item.id)) {
        skipped.push({ id: item.id, reason: "already exists" });
        continue;
      }
      try {
        if (body.axis === "trends") {
          await appendAddition("trends", item as TrendCandidate);
          const t = item as TrendCandidate;
          added.push({
            id: t.id,
            label: t.ko ? `${t.en} · ${t.ko}` : t.en,
          });
        } else {
          await appendAddition("research", item as ResearchCandidate);
          const r = item as ResearchCandidate;
          added.push({ id: r.id, label: r.title });
        }
        existingIds.add(item.id);
      } catch (err) {
        skipped.push({
          id: item.id,
          reason: err instanceof Error ? err.message : "accept failed",
        });
      }
    }

    return NextResponse.json({
      ok: true,
      mode: proposed.mode,
      provider: proposed.provider,
      note: proposed.note,
      added,
      skipped,
      candidates: proposed.candidates,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ingest failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
