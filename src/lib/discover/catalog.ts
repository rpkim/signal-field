import baseTrends from "@/data/trends.json";
import {
  listResearchFromDb,
  listTrendsFromDb,
} from "@/lib/db";

export async function getTrendsCatalog() {
  const items = listTrendsFromDb();
  const additionsCount = items.filter((i) => i.origin === "ai").length;
  return {
    ...baseTrends,
    items,
    additionsCount,
  };
}

export async function getResearchCatalog() {
  const items = listResearchFromDb();
  const additionsCount = items.filter((i) => i.origin === "ai").length;
  return {
    axis: "research" as const,
    label: "Research pillars",
    select: "multi" as const,
    max: 3,
    items,
    additionsCount,
  };
}
