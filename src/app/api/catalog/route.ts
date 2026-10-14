import { NextResponse } from "next/server";
import { getResearchCatalog, getTrendsCatalog } from "@/lib/discover/catalog";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const axis = searchParams.get("axis");
  if (axis === "trends") {
    return NextResponse.json(await getTrendsCatalog());
  }
  if (axis === "research") {
    return NextResponse.json(await getResearchCatalog());
  }
  return NextResponse.json({ error: "axis=trends|research required" }, { status: 400 });
}
