import { existsSync, mkdirSync, readFileSync } from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";
import baseResearch from "@/data/research.json";
import baseTrends from "@/data/trends.json";
import type { ResearchCandidate, TrendCandidate } from "./discover/types";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "signal-field.sqlite");

let dbSingleton: DatabaseSync | null = null;

function ensureSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS research_items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      year INTEGER,
      source TEXT,
      implications_json TEXT NOT NULL DEFAULT '[]',
      rule_deltas_json TEXT,
      rationale TEXT,
      prompt TEXT NOT NULL DEFAULT '',
      origin TEXT NOT NULL DEFAULT 'seed',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS trend_items (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      en TEXT NOT NULL,
      ko TEXT NOT NULL,
      what TEXT NOT NULL,
      when_text TEXT NOT NULL,
      skip TEXT NOT NULL,
      research_json TEXT NOT NULL DEFAULT '[]',
      refs_json TEXT NOT NULL DEFAULT '[]',
      log_date TEXT,
      sources_json TEXT,
      rationale TEXT,
      prompt TEXT NOT NULL DEFAULT '',
      origin TEXT NOT NULL DEFAULT 'seed',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

export function researchPrompt(item: {
  id: string;
  title: string;
  implications?: string[];
  source?: string;
}): string {
  const bullets = (item.implications || []).map((b) => `- ${b}`).join("\n");
  return [
    `Signal Field research pillar: ${item.title} (${item.id})`,
    item.source ? `Source: ${item.source}` : null,
    "",
    "Apply these implications to the UI/product work:",
    bullets || "- (no implications listed)",
    "",
    "Keep Signal Field norms: one accent family, quiet chrome, states before decoration.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function trendPrompt(item: {
  id: string;
  en: string;
  ko?: string;
  what: string;
  when: string;
  skip: string;
  category?: string;
}): string {
  return [
    `Signal Field trend: ${item.en}${item.ko ? ` / ${item.ko}` : ""} (${item.id})`,
    item.category ? `Category: ${item.category}` : null,
    "",
    `What: ${item.what}`,
    `When: ${item.when}`,
    `Skip when: ${item.skip}`,
    "",
    "Treat as secondary fashion — do not rewrite core Signal Field principles. Cite this trend if you apply it.",
  ]
    .filter(Boolean)
    .join("\n");
}

function seedIfNeeded(db: DatabaseSync) {
  const row = db
    .prepare("SELECT value FROM meta WHERE key = 'seeded'")
    .get() as { value?: string } | undefined;
  if (row?.value === "1") return;

  const now = new Date().toISOString();
  const insertR = db.prepare(`
    INSERT OR IGNORE INTO research_items
    (id, title, year, source, implications_json, rule_deltas_json, rationale, prompt, origin, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const item of baseResearch.items) {
    const prompt = researchPrompt(item);
    insertR.run(
      item.id,
      item.title,
      item.year ?? null,
      item.source ?? null,
      JSON.stringify(item.implications ?? []),
      item.ruleDeltas ? JSON.stringify(item.ruleDeltas) : null,
      null,
      prompt,
      "seed",
      now
    );
  }

  const insertT = db.prepare(`
    INSERT OR IGNORE INTO trend_items
    (id, category, en, ko, what, when_text, skip, research_json, refs_json, log_date, sources_json, rationale, prompt, origin, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const item of baseTrends.items) {
    const prompt = trendPrompt(item);
    insertT.run(
      item.id,
      item.category,
      item.en,
      item.ko,
      item.what,
      item.when,
      item.skip,
      JSON.stringify(item.research ?? []),
      JSON.stringify(item.refs ?? []),
      item.logDate ?? null,
      null,
      null,
      prompt,
      "seed",
      now
    );
  }

  // Migrate legacy JSON additions if present
  try {
    for (const axis of ["research", "trends"] as const) {
      const file = path.join(
        process.cwd(),
        "content",
        "additions",
        `${axis}.json`
      );
      if (!existsSync(file)) continue;
      const data = JSON.parse(readFileSync(file, "utf8")) as {
        items?: Array<Record<string, unknown>>;
      };
      for (const raw of data.items || []) {
        if (axis === "research") {
          const item = raw as unknown as ResearchCandidate;
          if (!item.id) continue;
          insertR.run(
            item.id,
            item.title,
            item.year ?? null,
            item.source ?? null,
            JSON.stringify(item.implications ?? []),
            item.ruleDeltas ? JSON.stringify(item.ruleDeltas) : null,
            item.rationale ?? null,
            researchPrompt(item),
            "ai",
            now
          );
        } else {
          const item = raw as unknown as TrendCandidate;
          if (!item.id) continue;
          insertT.run(
            item.id,
            item.category,
            item.en,
            item.ko,
            item.what,
            item.when,
            item.skip,
            JSON.stringify(item.research ?? []),
            JSON.stringify(item.refs ?? []),
            item.logDate ?? null,
            item.sources ? JSON.stringify(item.sources) : null,
            item.rationale ?? null,
            trendPrompt(item),
            "ai",
            now
          );
        }
      }
    }
  } catch {
    /* ignore migrate errors */
  }

  db.prepare(
    "INSERT OR REPLACE INTO meta (key, value) VALUES ('seeded', '1')"
  ).run();
}

export function getDb(): DatabaseSync {
  if (dbSingleton) return dbSingleton;
  if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  ensureSchema(db);
  seedIfNeeded(db);
  dbSingleton = db;
  return db;
}

export function listResearchFromDb(): Array<
  ResearchCandidate & { prompt: string; origin: string }
> {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT * FROM research_items ORDER BY CASE origin WHEN 'seed' THEN 0 ELSE 1 END, created_at ASC"
    )
    .all() as Array<Record<string, unknown>>;
  return rows.map((r) => ({
    id: String(r.id),
    title: String(r.title),
    year: Number(r.year) || 0,
    source: String(r.source || ""),
    implications: JSON.parse(String(r.implications_json || "[]")) as string[],
    ruleDeltas: r.rule_deltas_json
      ? (JSON.parse(String(r.rule_deltas_json)) as Record<string, string>)
      : undefined,
    rationale: r.rationale ? String(r.rationale) : undefined,
    prompt: String(r.prompt || ""),
    origin: String(r.origin || "seed"),
  }));
}

export function listTrendsFromDb(): Array<
  TrendCandidate & { prompt: string; origin: string }
> {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT * FROM trend_items ORDER BY CASE origin WHEN 'seed' THEN 0 ELSE 1 END, created_at ASC"
    )
    .all() as Array<Record<string, unknown>>;
  return rows.map((r) => ({
    id: String(r.id),
    category: String(r.category),
    en: String(r.en),
    ko: String(r.ko),
    what: String(r.what),
    when: String(r.when_text),
    skip: String(r.skip),
    research: JSON.parse(String(r.research_json || "[]")) as string[],
    refs: JSON.parse(String(r.refs_json || "[]")) as string[],
    logDate: String(r.log_date || ""),
    sources: r.sources_json
      ? (JSON.parse(String(r.sources_json)) as string[])
      : undefined,
    rationale: r.rationale ? String(r.rationale) : undefined,
    prompt: String(r.prompt || ""),
    origin: String(r.origin || "seed"),
  }));
}

export function insertResearchDb(item: ResearchCandidate, origin = "ai") {
  const db = getDb();
  const prompt = researchPrompt(item);
  db.prepare(
    `INSERT INTO research_items
    (id, title, year, source, implications_json, rule_deltas_json, rationale, prompt, origin, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    item.id,
    item.title,
    item.year ?? null,
    item.source ?? null,
    JSON.stringify(item.implications ?? []),
    item.ruleDeltas ? JSON.stringify(item.ruleDeltas) : null,
    item.rationale ?? null,
    prompt,
    origin,
    new Date().toISOString()
  );
  return { ...item, prompt, origin };
}

export function insertTrendDb(item: TrendCandidate, origin = "ai") {
  const db = getDb();
  const prompt = trendPrompt(item);
  db.prepare(
    `INSERT INTO trend_items
    (id, category, en, ko, what, when_text, skip, research_json, refs_json, log_date, sources_json, rationale, prompt, origin, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    item.id,
    item.category,
    item.en,
    item.ko,
    item.what,
    item.when,
    item.skip,
    JSON.stringify(item.research ?? []),
    JSON.stringify(item.refs ?? []),
    item.logDate ?? null,
    item.sources ? JSON.stringify(item.sources) : null,
    item.rationale ?? null,
    prompt,
    origin,
    new Date().toISOString()
  );
  return { ...item, prompt, origin };
}

export function deleteCatalogItem(
  axis: "research" | "trends",
  id: string
): boolean {
  const db = getDb();
  const table = axis === "research" ? "research_items" : "trend_items";
  // Only allow deleting AI-added rows from admin (protect seed)
  const row = db
    .prepare(`SELECT origin FROM ${table} WHERE id = ?`)
    .get(id) as { origin?: string } | undefined;
  if (!row) return false;
  if (row.origin === "seed") {
    throw new Error("Cannot delete seeded catalog items");
  }
  const result = db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
  return Number(result.changes || 0) > 0;
}

export function allCatalogIds(axis: "research" | "trends"): Set<string> {
  if (axis === "research") return new Set(listResearchFromDb().map((i) => i.id));
  return new Set(listTrendsFromDb().map((i) => i.id));
}
