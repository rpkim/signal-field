import { promises as fs } from "fs";
import path from "path";
import type {
  DiscoverAxis,
  ResearchCandidate,
  TrendCandidate,
} from "./types";

type AdditionsFile<T> = { items: T[] };

function additionsPath(axis: DiscoverAxis) {
  return path.join(process.cwd(), "content", "additions", `${axis}.json`);
}

export async function readAdditions(
  axis: "trends"
): Promise<TrendCandidate[]>;
export async function readAdditions(
  axis: "research"
): Promise<ResearchCandidate[]>;
export async function readAdditions(
  axis: DiscoverAxis
): Promise<TrendCandidate[] | ResearchCandidate[]> {
  const file = additionsPath(axis);
  try {
    const raw = await fs.readFile(file, "utf8");
    const data = JSON.parse(raw) as AdditionsFile<
      TrendCandidate | ResearchCandidate
    >;
    if (axis === "trends") return (data.items ?? []) as TrendCandidate[];
    return (data.items ?? []) as ResearchCandidate[];
  } catch {
    return [];
  }
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
  const file = additionsPath(axis);
  const existing = (await readAdditions(axis as "trends")) as (
    | TrendCandidate
    | ResearchCandidate
  )[];
  if (existing.some((x) => x.id === item.id)) {
    throw new Error(`Item already exists: ${item.id}`);
  }
  const next = [...existing, item];
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(
    file,
    JSON.stringify({ items: next }, null, 2) + "\n",
    "utf8"
  );
  return next;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 48) || `item-${Date.now().toString(36)}`;
}
