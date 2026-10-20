import type { ColorItem, DensityItem, MixState, TypeItem } from "./types";

export type ResearchLike = {
  id: string;
  ruleDeltas?: Record<string, string>;
};

export type TrendLike = {
  id: string;
  tokenDeltas?: Record<string, string>;
};

export type ReferenceLike = {
  id: string;
  tokenDeltas?: { [key: string]: string | undefined };
};

/** Merge color + density + research, then reference leans, then trend deltas. */
export function mergeMixTokens(opts: {
  mix: MixState;
  color: ColorItem;
  type: TypeItem;
  density: DensityItem;
  researchItems?: ResearchLike[];
  referenceItems?: ReferenceLike[];
  trendItems?: TrendLike[];
}): Record<string, string> {
  const {
    mix,
    color,
    type,
    density,
    researchItems = [],
    referenceItems = [],
    trendItems = [],
  } = opts;

  const vars: Record<string, string> = {
    ...color.roles,
    ...density.tokens,
    "--font-display": `"${type.display}", ${type.fallbacks}`,
    "--font-body": `"${type.body}", ${type.fallbacks}`,
    "--font-mono": type.mono
      ? `"${type.mono}", ui-monospace, Menlo, monospace`
      : "ui-monospace, Menlo, monospace",
    "--tracking-display": type.trackingDisplay,
  };

  for (const id of mix.research || []) {
    const item = researchItems.find((r) => r.id === id);
    if (!item?.ruleDeltas) continue;
    for (const [k, v] of Object.entries(item.ruleDeltas)) {
      if (k.startsWith("--") && typeof v === "string") vars[k] = v;
    }
  }

  for (const id of mix.references || []) {
    const item = referenceItems.find((r) => r.id === id);
    if (!item?.tokenDeltas) continue;
    for (const [k, v] of Object.entries(item.tokenDeltas)) {
      if (k.startsWith("--") && typeof v === "string") vars[k] = v;
    }
  }

  for (const id of mix.trends || []) {
    const item = trendItems.find((t) => t.id === id);
    if (!item?.tokenDeltas) continue;
    for (const [k, v] of Object.entries(item.tokenDeltas)) {
      if (k.startsWith("--") && typeof v === "string") vars[k] = v;
    }
  }

  return vars;
}

/** Policy / non-paint flags stored as data attributes, not CSS paint. */
export function researchSurfaceMode(researchIds: string[]): string {
  if (researchIds.includes("apple-deference")) return "glass";
  if (researchIds.includes("wcag-22") && researchIds.includes("content-plain"))
    return "utility";
  return "solid";
}
