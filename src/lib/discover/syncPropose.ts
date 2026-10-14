import type { MixState } from "@/lib/types";
import type { ResearchCandidate, TrendCandidate } from "./types";

export type SyncSuggestion = {
  id: string;
  kind: "add-research" | "replace-research" | "add-trend";
  targetId: string;
  label: string;
  reason: string;
  replaceId?: string;
};

export function proposeSync(input: {
  mix: MixState;
  newResearch: ResearchCandidate[];
  newTrends: TrendCandidate[];
}): { suggestions: SyncSuggestion[]; note: string } {
  const suggestions: SyncSuggestion[] = [];
  const research = [...input.mix.research];
  const maxResearch = 3;

  for (const item of input.newResearch.slice(0, 4)) {
    if (research.includes(item.id)) continue;
    if (research.length < maxResearch) {
      suggestions.push({
        id: `add-research-${item.id}`,
        kind: "add-research",
        targetId: item.id,
        label: item.title,
        reason:
          item.implications?.[0] ||
          "New research pillar — add into Compose research axis.",
      });
    } else {
      const replaceId = research[research.length - 1];
      suggestions.push({
        id: `replace-research-${item.id}`,
        kind: "replace-research",
        targetId: item.id,
        replaceId,
        label: item.title,
        reason: `Research axis full — replace \`${replaceId}\` with this pillar.`,
      });
    }
  }

  const trends = new Set(input.mix.trends || []);
  for (const item of input.newTrends.slice(0, 4)) {
    if (trends.has(item.id)) continue;
    suggestions.push({
      id: `add-trend-${item.id}`,
      kind: "add-trend",
      targetId: item.id,
      label: item.en,
      reason: item.what || "Link this trend into the saved mix context.",
    });
  }

  return {
    suggestions,
    note:
      suggestions.length === 0
        ? "No new catalog items to incorporate — mix already covers additions."
        : "Review each suggestion. Nothing applies until you confirm.",
  };
}

export function applySuggestions(
  mix: MixState,
  accepted: SyncSuggestion[]
): MixState {
  const next: MixState = {
    ...mix,
    research: [...mix.research],
    references: [...mix.references],
    trends: [...(mix.trends || [])],
  };
  for (const s of accepted) {
    if (s.kind === "add-research") {
      if (!next.research.includes(s.targetId) && next.research.length < 3) {
        next.research.push(s.targetId);
      }
    } else if (s.kind === "replace-research") {
      if (s.replaceId) {
        next.research = next.research.filter((id) => id !== s.replaceId);
      }
      if (!next.research.includes(s.targetId) && next.research.length < 3) {
        next.research.push(s.targetId);
      }
    } else if (s.kind === "add-trend") {
      if (!next.trends!.includes(s.targetId)) next.trends!.push(s.targetId);
    }
  }
  return next;
}
