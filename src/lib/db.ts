import { existsSync, mkdirSync, readFileSync } from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";
import baseResearch from "@/data/research.json";
import baseTrends from "@/data/trends.json";
import type { ResearchCandidate, TrendCandidate } from "./discover/types";

const DB_DIR = process.env.VERCEL
  ? path.join("/tmp", "signal-field")
  : path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "signal-field.sqlite");

export type StoredResearch = ResearchCandidate & { origin: string };
export type StoredTrend = TrendCandidate & { origin: string };

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
      origin TEXT NOT NULL DEFAULT 'seed',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  const researchColumns = db.prepare("PRAGMA table_info(research_items)").all() as {
    name?: string;
  }[];
  if (!researchColumns.some((column) => column.name === "sources_json")) {
    db.exec("ALTER TABLE research_items ADD COLUMN sources_json TEXT");
  }
}

function seedIfNeeded(db: DatabaseSync) {
  const row = db.prepare("SELECT value FROM meta WHERE key = 'seeded'").get() as
    | { value?: string }
    | undefined;
  if (row?.value === "1") return;

  const now = new Date().toISOString();
  const insertR = db.prepare(`
    INSERT OR IGNORE INTO research_items
    (id, title, year, source, implications_json, rule_deltas_json, rationale, origin, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'seed', ?)
  `);
  for (const item of baseResearch.items) {
    insertR.run(
      item.id,
      item.title,
      item.year ?? null,
      item.source ?? null,
      JSON.stringify(item.implications ?? []),
      item.ruleDeltas ? JSON.stringify(item.ruleDeltas) : null,
      null,
      now
    );
  }

  const insertT = db.prepare(`
    INSERT OR IGNORE INTO trend_items
    (id, category, en, ko, what, when_text, skip, research_json, refs_json, log_date, sources_json, rationale, origin, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'seed', ?)
  `);
  for (const item of baseTrends.items) {
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
      now
    );
  }

  for (const axis of ["research", "trends"] as const) {
    const file = path.join(process.cwd(), "content", "additions", `${axis}.json`);
    if (!existsSync(file)) continue;
    const data = JSON.parse(readFileSync(file, "utf8")) as {
      items?: Array<ResearchCandidate | TrendCandidate>;
    };
    for (const raw of data.items || []) {
      if (axis === "research") {
        const item = raw as ResearchCandidate;
        if (!item.id || !item.title) continue;
        insertR.run(
          item.id,
          item.title,
          item.year ?? null,
          item.source ?? null,
          JSON.stringify(item.implications ?? []),
          item.ruleDeltas ? JSON.stringify(item.ruleDeltas) : null,
          item.rationale ?? null,
          now
        );
      } else {
        const item = raw as TrendCandidate;
        if (!item.id || !item.en) continue;
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
          now
        );
      }
    }
  }

  db.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES ('seeded', '1')").run();
  db.prepare(
    `UPDATE research_items SET origin = 'local'
     WHERE id NOT IN (${baseResearch.items.map(() => "?").join(",")})`
  ).run(...baseResearch.items.map((item) => item.id));
  db.prepare(
    `UPDATE trend_items SET origin = 'local'
     WHERE id NOT IN (${baseTrends.items.map(() => "?").join(",")})`
  ).run(...baseTrends.items.map((item) => item.id));
}

function syncBaseResearch(db: DatabaseSync) {
  const now = new Date().toISOString();
  const insert = db.prepare(`
    INSERT OR IGNORE INTO research_items
    (id, title, year, source, sources_json, implications_json, rule_deltas_json, rationale, origin, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'seed', ?)
  `);
  for (const item of baseResearch.items) {
    const sources = JSON.stringify(item.sources ?? (item.source ? [item.source] : []));
    insert.run(
      item.id,
      item.title,
      item.year ?? null,
      item.source ?? null,
      sources,
      JSON.stringify(item.implications ?? []),
      item.ruleDeltas ? JSON.stringify(item.ruleDeltas) : null,
      null,
      now
    );
  }
}

function syncBaseTrends(db: DatabaseSync) {
  const now = new Date().toISOString();
  const insert = db.prepare(`
    INSERT OR IGNORE INTO trend_items
    (id, category, en, ko, what, when_text, skip, research_json, refs_json, log_date, sources_json, rationale, origin, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'seed', ?)
  `);
  const fillSources = db.prepare(
    `UPDATE trend_items
     SET sources_json = ?, log_date = COALESCE(log_date, ?)
     WHERE id = ? AND (sources_json IS NULL OR sources_json IN ('null', '[]'))`
  );
  for (const item of baseTrends.items) {
    const sources = JSON.stringify(item.sources ?? []);
    insert.run(
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
      sources,
      null,
      now
    );
    fillSources.run(sources, item.logDate ?? null, item.id);
  }
}

export function getDb() {
  if (!dbSingleton) {
    if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });
    const db = new DatabaseSync(DB_PATH);
    ensureSchema(db);
    seedIfNeeded(db);
    syncBaseResearch(db);
    syncBaseTrends(db);
    dbSingleton = db;
  }
  return dbSingleton;
}

function mapResearch(row: Record<string, unknown>): StoredResearch {
  return {
    id: String(row.id),
    title: String(row.title),
    year: Number(row.year) || new Date().getFullYear(),
    source: String(row.source || ""),
    sources: row.sources_json
      ? (JSON.parse(String(row.sources_json)) as string[])
      : row.source
        ? [String(row.source)]
        : [],
    implications: JSON.parse(String(row.implications_json || "[]")) as string[],
    ruleDeltas: row.rule_deltas_json
      ? (JSON.parse(String(row.rule_deltas_json)) as Record<string, string>)
      : undefined,
    rationale: row.rationale ? String(row.rationale) : undefined,
    origin: String(row.origin || "seed"),
  };
}

function mapTrend(row: Record<string, unknown>): StoredTrend {
  return {
    id: String(row.id),
    category: String(row.category),
    en: String(row.en),
    ko: String(row.ko),
    what: String(row.what),
    when: String(row.when_text),
    skip: String(row.skip),
    research: JSON.parse(String(row.research_json || "[]")) as string[],
    refs: JSON.parse(String(row.refs_json || "[]")) as string[],
    logDate: String(row.log_date || ""),
    sources: row.sources_json
      ? (JSON.parse(String(row.sources_json)) as string[])
      : undefined,
    rationale: row.rationale ? String(row.rationale) : undefined,
    origin: String(row.origin || "seed"),
  };
}

export function listResearchFromDb(): StoredResearch[] {
  const rows = getDb()
    .prepare(
      "SELECT * FROM research_items ORDER BY CASE origin WHEN 'seed' THEN 0 ELSE 1 END, created_at ASC"
    )
    .all() as Record<string, unknown>[];
  return rows.map(mapResearch);
}

export function listTrendsFromDb(): StoredTrend[] {
  const rows = getDb()
    .prepare(
      "SELECT * FROM trend_items ORDER BY CASE origin WHEN 'seed' THEN 0 ELSE 1 END, created_at ASC"
    )
    .all() as Record<string, unknown>[];
  return rows.map(mapTrend);
}

export function saveResearch(item: ResearchCandidate, origin = "local") {
  const db = getDb();
  const existing = db
    .prepare("SELECT origin FROM research_items WHERE id = ?")
    .get(item.id) as { origin?: string } | undefined;
  db.prepare(
    `INSERT INTO research_items
      (id, title, year, source, sources_json, implications_json, rule_deltas_json, rationale, origin, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      year = excluded.year,
      source = excluded.source,
      sources_json = excluded.sources_json,
      implications_json = excluded.implications_json,
      rule_deltas_json = excluded.rule_deltas_json,
      rationale = excluded.rationale`
  ).run(
    item.id,
    item.title,
    item.year ?? null,
    item.source ?? null,
    JSON.stringify(item.sources ?? (item.source ? [item.source] : [])),
    JSON.stringify(item.implications ?? []),
    item.ruleDeltas ? JSON.stringify(item.ruleDeltas) : null,
    item.rationale ?? null,
    existing?.origin || origin,
    new Date().toISOString()
  );
}

export function saveTrend(item: TrendCandidate, origin = "local") {
  const db = getDb();
  const existing = db
    .prepare("SELECT origin FROM trend_items WHERE id = ?")
    .get(item.id) as { origin?: string } | undefined;
  db.prepare(
    `INSERT INTO trend_items
      (id, category, en, ko, what, when_text, skip, research_json, refs_json, log_date, sources_json, rationale, origin, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
      category = excluded.category,
      en = excluded.en,
      ko = excluded.ko,
      what = excluded.what,
      when_text = excluded.when_text,
      skip = excluded.skip,
      research_json = excluded.research_json,
      refs_json = excluded.refs_json,
      log_date = excluded.log_date,
      sources_json = excluded.sources_json,
      rationale = excluded.rationale`
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
    existing?.origin || origin,
    new Date().toISOString()
  );
}

export function deleteCatalogItem(axis: "research" | "trends", id: string) {
  const table = axis === "research" ? "research_items" : "trend_items";
  const result = getDb().prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
  return Number(result.changes || 0) > 0;
}
