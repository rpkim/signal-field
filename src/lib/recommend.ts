export type RecommendRule = {
  id: string;
  keywords: string[];
  mix: {
    preset: string | null;
    color: string;
    type: string;
    density: string;
    research: string[];
    references: string[];
  };
  trends: string[];
  why: string;
};

export const RULES: RecommendRule[] = [
  {
    id: "fintech",
    keywords: ["fintech", "bank", "ledger", "trading", "payment", "금융", "결제", "장부"],
    mix: {
      preset: "ink-ledger",
      color: "ledger-slate",
      type: "grotesk-source",
      density: "compact",
      research: ["wcag-22", "m3-roles"],
      references: ["ibm-lang", "atlassian"],
    },
    trends: ["chromatic-restraint", "utility-contrast"],
    why: "Dense fintech surfaces need slate trust and compact grotesk UI.",
  },
  {
    id: "commerce",
    keywords: ["commerce", "shop", "store", "checkout", "커머스", "쇼핑", "스토어"],
    mix: {
      preset: "warm-commerce",
      color: "kiln-copper",
      type: "outfit-source",
      density: "comfortable",
      research: ["m3-roles", "content-plain"],
      references: ["polaris"],
    },
    trends: ["quiet-commerce"],
    why: "Warm copper on stone without cream+terracotta clichés.",
  },
  {
    id: "admin",
    keywords: ["admin", "saas", "dashboard", "b2b", "console", "관리자", "대시보드"],
    mix: {
      preset: "precise-quiet",
      color: "signal-teal",
      type: "plex",
      density: "default",
      research: ["wcag-22", "m3-roles", "fluid-type"],
      references: ["ibm-lang", "atlassian"],
    },
    trends: ["compose-export", "deference-chrome"],
    why: "Precise quiet with IBM Plex fits B2B/SaaS chrome.",
  },
  {
    id: "education",
    keywords: ["education", "learning", "course", "교육", "학습"],
    mix: {
      preset: "day-editorial",
      color: "day-mist",
      type: "plex",
      density: "comfortable",
      research: ["fluid-type", "content-plain"],
      references: ["govuk"],
    },
    trends: ["fluid-rem-type", "guidelines-framing"],
    why: "Day mist supports long reading calm.",
  },
  {
    id: "consumer",
    keywords: ["consumer", "lifestyle", "onboarding", "소비자", "라이프"],
    mix: {
      preset: "soft-product",
      color: "soft-sage",
      type: "jakarta",
      density: "comfortable",
      research: ["apple-deference", "fluid-type"],
      references: ["brandnew"],
    },
    trends: ["deference-chrome"],
    why: "Soft sage reads gentle consumer product.",
  },
  {
    id: "a11y",
    keywords: ["a11y", "accessibility", "government", "접근성", "공공"],
    mix: {
      preset: "utility-clear",
      color: "clear-ink",
      type: "plex",
      density: "a11y-large",
      research: ["wcag-22", "content-plain"],
      references: ["govuk"],
    },
    trends: ["utility-contrast"],
    why: "Maximum clarity for public/accessibility contexts.",
  },
];

const FALLBACK = RULES.find((r) => r.id === "admin")!;

export function recommend(brief: string) {
  const t = brief.toLowerCase();
  const ranked = RULES.map((rule) => {
    const hits = rule.keywords.filter((k) => t.includes(k.toLowerCase()));
    return { rule, score: hits.length * 3, hits };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const picks = ranked.length
    ? ranked.slice(0, 3)
    : [{ rule: FALLBACK, score: 0, hits: [] as string[] }];

  while (picks.length < 3) {
    const next = RULES.find((r) => !picks.some((p) => p.rule.id === r.id));
    if (!next) break;
    picks.push({ rule: next, score: 0, hits: [] });
  }

  const rebrand =
    /rebrand|restyle|기존|리브랜드|https?:\/\//i.test(brief) ||
    /https?:\/\/\S+/i.test(brief);

  return { picks, rebrand };
}

export function composeHref(mix: RecommendRule["mix"]) {
  const q = new URLSearchParams();
  if (mix.preset) q.set("preset", mix.preset);
  q.set("color", mix.color);
  q.set("type", mix.type);
  q.set("density", mix.density);
  q.set("research", mix.research.join(","));
  q.set("references", mix.references.join(","));
  return `/compose?${q.toString()}`;
}
