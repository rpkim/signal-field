import { NextResponse } from "next/server";
import { getSavedMix, listSavedMixes, saveMix } from "@/lib/savedMixes";
import type { MixState } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const item = await getSavedMix(id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  }
  return NextResponse.json({ items: await listSavedMixes() });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { name?: string; mix?: MixState };
    if (!body.mix?.color || !body.mix?.type || !body.mix?.density) {
      return NextResponse.json({ error: "mix required" }, { status: 400 });
    }
    const entry = await saveMix(body.name || "Untitled mix", body.mix);
    return NextResponse.json(entry);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
