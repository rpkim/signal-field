import baseTrends from "@/data/trends.json";
import { listResearchFromDb, listTrendsFromDb } from "@/lib/db";

export async function getTrendsCatalog() {
  const items = listTrendsFromDb();
  return {
    ...baseTrends,
    items,
    additionsCount: items.filter((item) => item.origin !== "seed").length,
  };
}

export async function getResearchCatalog() {
  const items = listResearchFromDb();
  return {
    items,
    additionsCount: items.filter((item) => item.origin !== "seed").length,
  };
}
