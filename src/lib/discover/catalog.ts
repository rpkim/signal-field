import baseResearch from "@/data/research.json";
import baseTrends from "@/data/trends.json";
import { readAdditions } from "./store";
import type { ResearchCandidate, TrendCandidate } from "./types";

export async function getTrendsCatalog() {
  const additions = await readAdditions("trends");
  const seen = new Set(baseTrends.items.map((i) => i.id));
  const extra = additions.filter((i) => !seen.has(i.id));
  return {
    ...baseTrends,
    items: [...baseTrends.items, ...extra] as typeof baseTrends.items &
      TrendCandidate[],
    additionsCount: extra.length,
  };
}

export async function getResearchCatalog() {
  const additions = await readAdditions("research");
  const seen = new Set(baseResearch.items.map((i) => i.id));
  const extra = additions.filter((i) => !seen.has(i.id));
  return {
    ...baseResearch,
    items: [...baseResearch.items, ...extra] as (typeof baseResearch.items[number] | ResearchCandidate)[],
    additionsCount: extra.length,
  };
}
