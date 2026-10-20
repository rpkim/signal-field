import { NextResponse } from "next/server";
import baseTrends from "@/data/trends.json";
import { isAdminRequest } from "@/lib/adminAuth";
import {
  deleteCatalogItem,
  listResearchFromDb,
  listTrendsFromDb,
  saveResearch,
  saveTrend,
} from "@/lib/db";
import { slugify } from "@/lib/discover/store";
import type {
  DiscoverAxis,
  ResearchCandidate,
  TrendCandidate,
} from "@/lib/discover/types";

function isAxis(value: unknown): value is DiscoverAxis {
  return value === "trends" || value === "research";
}

function cleanUrls(value: unknown) {
  const list = Array.isArray(value) ? value : [];
  const urls: string[] = [];
  for (const entry of list) {
    let url = String(entry || "").trim();
    if (/^www\./i.test(url)) url = `https://${url}`;
    if (!/^https?:\/\//i.test(url) || urls.includes(url)) continue;
    urls.push(url);
  }
  return urls.slice(0, 8);
}

function asTrend(raw: TrendCandidate): TrendCandidate {
  const en = String(raw.en || "").trim();
  if (!en) throw new Error("English name is required");
  return {
    id: slugify(String(raw.id || en)),
    category: String(raw.category || "platform"),
    en,
    ko: String(raw.ko || en).trim(),
    what: String(raw.what || "").trim(),
    when: String(raw.when || "").trim(),
    skip: String(raw.skip || "").trim(),
    research: Array.isArray(raw.research) ? raw.research.map(String) : [],
    refs: Array.isArray(raw.refs) ? raw.refs.map(String) : [],
    logDate: String(raw.logDate || new Date().toISOString().slice(0, 10)),
    sources: cleanUrls(raw.sources),
    rationale: raw.rationale ? String(raw.rationale) : undefined,
  };
}

function asResearch(raw: ResearchCandidate): ResearchCandidate {
  const title = String(raw.title || "").trim();
  if (!title) throw new Error("Title is required");
  const implications = Array.isArray(raw.implications)
    ? raw.implications.map((line) => String(line).trim()).filter(Boolean)
    : [];
  const sources = cleanUrls([
    ...(raw.source ? [raw.source] : []),
    ...(Array.isArray(raw.sources) ? raw.sources : []),
  ]);
  return {
    id: slugify(String(raw.id || title)),
    title,
    year: Number(raw.year) || new Date().getFullYear(),
    source: sources[0] || "",
    sources,
    implications: implications.length ? implications : ["State the constraint in one sentence."],
    ruleDeltas: raw.ruleDeltas,
    rationale: raw.rationale ? String(raw.rationale) : undefined,
  };
}

async function gate() {
  if (await isAdminRequest()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  const denied = await gate();
  if (denied) return denied;
  return NextResponse.json({
    trends: { items: listTrendsFromDb(), categories: baseTrends.categories },
    research: { items: listResearchFromDb() },
  });
}

export async function POST(req: Request) {
  const denied = await gate();
  if (denied) return denied;
  try {
    const body = (await req.json()) as {
      axis?: DiscoverAxis;
      action?: "create" | "update" | "delete";
      id?: string;
      item?: TrendCandidate | ResearchCandidate;
    };
    if (!isAxis(body.axis)) {
      return NextResponse.json({ error: "axis must be trends|research" }, { status: 400 });
    }

    if (body.action === "delete") {
      const id = String(body.id || "");
      if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
      const ok = deleteCatalogItem(body.axis, id);
      if (!ok) return NextResponse.json({ error: "Item not found" }, { status: 404 });
      return NextResponse.json({ ok: true });
    }

    if (body.action !== "create" && body.action !== "update") {
      return NextResponse.json({ error: "action must be create|update|delete" }, { status: 400 });
    }
    if (!body.item) return NextResponse.json({ error: "item required" }, { status: 400 });

    if (body.axis === "trends") {
      const item = asTrend(body.item as TrendCandidate);
      if (body.action === "update") item.id = String(body.item.id || item.id);
      const exists = listTrendsFromDb().some((row) => row.id === item.id);
      if (body.action === "create" && exists) {
        return NextResponse.json({ error: "Already in the catalog" }, { status: 409 });
      }
      saveTrend(item);
      return NextResponse.json({ ok: true, item });
    }

    const item = asResearch(body.item as ResearchCandidate);
    if (body.action === "update") item.id = String(body.item.id || item.id);
    const exists = listResearchFromDb().some((row) => row.id === item.id);
    if (body.action === "create" && exists) {
      return NextResponse.json({ error: "Already in the catalog" }, { status: 409 });
    }
    saveResearch(item);
    return NextResponse.json({ ok: true, item });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
