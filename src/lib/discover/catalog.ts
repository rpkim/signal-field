import baseResearch from "@/data/research.json";
import baseTrends from "@/data/trends.json";
import { listResearchFromDb, listTrendsFromDb } from "@/lib/db";

export async function getTrendsCatalog() {
  const baseById = new Map(baseTrends.items.map((item) => [item.id, item]));
  const items = listTrendsFromDb().map((item) => {
    const base = baseById.get(item.id);
    if (!base) return item;
    return {
      ...item,
      tokenDeltas: item.tokenDeltas ?? base.tokenDeltas,
      suggestMix: item.suggestMix ?? base.suggestMix,
      sources: item.sources?.length ? item.sources : base.sources,
      logDate: item.logDate || base.logDate,
    };
  });
  return {
    ...baseTrends,
    items,
    additionsCount: items.filter((item) => item.origin !== "seed").length,
  };
}

export async function getResearchCatalog() {
  const baseById = new Map(baseResearch.items.map((item) => [item.id, item]));
  const items = listResearchFromDb().map((item) => {
    const base = baseById.get(item.id);
    if (!base) return item;
    return {
      ...item,
      year: item.year || base.year,
      source: item.source || base.source,
      sources: item.sources?.length ? item.sources : base.sources,
      ruleDeltas: item.ruleDeltas ?? base.ruleDeltas,
    };
  });
  return {
    items,
    additionsCount: items.filter((item) => item.origin !== "seed").length,
  };
}
