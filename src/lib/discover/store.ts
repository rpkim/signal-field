import {
  allCatalogIds,
  deleteCatalogItem,
  insertResearchDb,
  insertTrendDb,
  listResearchFromDb,
  listTrendsFromDb,
} from "@/lib/db";
import type {
  DiscoverAxis,
  ResearchCandidate,
  TrendCandidate,
} from "./types";

export async function readAdditions(
  axis: "trends"
): Promise<TrendCandidate[]>;
export async function readAdditions(
  axis: "research"
): Promise<ResearchCandidate[]>;
export async function readAdditions(
  axis: DiscoverAxis
): Promise<TrendCandidate[] | ResearchCandidate[]> {
  if (axis === "trends") {
    return listTrendsFromDb().filter((i) => i.origin === "ai");
  }
  return listResearchFromDb().filter((i) => i.origin === "ai");
}

export async function appendAddition(
  axis: "trends",
  item: TrendCandidate
): Promise<TrendCandidate[]>;
export async function appendAddition(
  axis: "research",
  item: ResearchCandidate
): Promise<ResearchCandidate[]>;
export async function appendAddition(
  axis: DiscoverAxis,
  item: TrendCandidate | ResearchCandidate
) {
  const ids = allCatalogIds(axis);
  if (ids.has(item.id)) {
    throw new Error(`Item already exists: ${item.id}`);
  }
  if (axis === "trends") {
    insertTrendDb(item as TrendCandidate, "ai");
    return readAdditions("trends");
  }
  insertResearchDb(item as ResearchCandidate, "ai");
  return readAdditions("research");
}

export async function removeAddition(axis: DiscoverAxis, id: string) {
  return deleteCatalogItem(axis, id);
}

export function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 48) || `item-${Date.now().toString(36)}`
  );
}
