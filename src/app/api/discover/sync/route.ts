import { NextResponse } from "next/server";
import { readAdditions } from "@/lib/discover/store";
import { proposeSync } from "@/lib/discover/syncPropose";
import type { MixState } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { mix?: MixState };
    if (!body.mix) {
      return NextResponse.json({ error: "mix required" }, { status: 400 });
    }
    const newResearch = await readAdditions("research");
    const newTrends = await readAdditions("trends");
    const result = proposeSync({
      mix: body.mix,
      newResearch,
      newTrends,
    });
    return NextResponse.json({
      ...result,
      newResearch,
      newTrends,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync propose failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
