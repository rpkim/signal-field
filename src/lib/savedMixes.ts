import { promises as fs } from "fs";
import path from "path";
import type { MixState, SavedMix } from "./types";
import { slugify } from "./discover/store";

type FileShape = { items: SavedMix[] };

function filePath() {
  return path.join(process.cwd(), "content", "saved-mixes.json");
}

export async function listSavedMixes(): Promise<SavedMix[]> {
  try {
    const raw = await fs.readFile(filePath(), "utf8");
    const data = JSON.parse(raw) as FileShape;
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function getSavedMix(id: string) {
  const items = await listSavedMixes();
  return items.find((x) => x.id === id) || null;
}

export async function saveMix(name: string, mix: MixState): Promise<SavedMix> {
  const items = await listSavedMixes();
  const base = slugify(name) || `mix-${Date.now().toString(36)}`;
  let id = base;
  let n = 2;
  while (items.some((x) => x.id === id)) {
    id = `${base}-${n++}`;
  }
  const entry: SavedMix = {
    id,
    name: name.trim() || id,
    createdAt: new Date().toISOString(),
    mix: {
      research: [...mix.research],
      references: [...mix.references],
      color: mix.color,
      type: mix.type,
      density: mix.density,
      trends: [...(mix.trends || [])],
    },
  };
  const next = [entry, ...items];
  await fs.writeFile(
    filePath(),
    JSON.stringify({ items: next }, null, 2) + "\n",
    "utf8"
  );
  return entry;
}
