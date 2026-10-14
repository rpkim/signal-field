import { slugify } from "./store";
import type {
  DiscoverAxis,
  ProposeResult,
  ResearchCandidate,
  TrendCandidate,
} from "./types";

const TREND_CATS = ["type", "color", "motion", "layout", "platform", "a11y"];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function extractUrls(text: string) {
  return [...text.matchAll(/https?:\/\/[^\s)]+/gi)].map((m) =>
    m[0].replace(/[.,;]+$/, "")
  );
}

async function fetchPageHint(url: string) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "SignalFieldDiscover/1.0" },
    });
    clearTimeout(t);
    if (!res.ok) return { url, title: url };
    const html = await res.text();
    const og =
      html.match(
        /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i
      ) ||
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i
      );
    const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = (og?.[1] || titleTag?.[1] || url).trim().slice(0, 140);
    return { url, title };
  } catch {
    return { url, title: url };
  }
}

function offlineTrends(
  topic: string,
  notes: string,
  sources: { url: string; title: string }[]
): TrendCandidate[] {
  const focus =
    topic.trim() ||
    sources[0]?.title ||
    "Current product UI craft";
  const baseId = slugify(focus);
  const category =
    TREND_CATS.find((c) => focus.toLowerCase().includes(c)) ||
    (notes.toLowerCase().includes("a11y") || notes.toLowerCase().includes("access")
      ? "a11y"
      : notes.toLowerCase().includes("type") || notes.toLowerCase().includes("font")
        ? "type"
        : notes.toLowerCase().includes("motion")
          ? "motion"
          : "platform");

  const primary: TrendCandidate = {
    id: `${baseId}-trend`,
    category,
    en: focus.slice(0, 80),
    ko: focus.slice(0, 40),
    what:
      notes.trim().split("\n").find((l) => l.trim().length > 12)?.trim() ||
      `Adopt ${focus} with Signal Field restraint — one accent, quiet chrome.`,
    when: "Product UI and guidelines-adjacent surfaces when the pattern is proven.",
    skip: "Admin density tools and print unless the pattern is utility-first.",
    research: ["apple-deference", "content-plain"],
    refs: [],
    logDate: today(),
    sources: sources.map((s) => s.url),
    rationale: "Offline structure from topic/notes/URLs (no AI key).",
  };

  const secondary: TrendCandidate = {
    id: `${baseId}-restraint`,
    category: category === "color" ? "layout" : "color",
    en: `${focus.slice(0, 40)} · restrained apply`,
    ko: "절제된 적용",
    what: "Keep the signal; reject SaaS card farms, glow stacks, and second accents.",
    when: "Whenever applying a newly discovered trend into Signal Field.",
    skip: "Never skip the restraint check.",
    research: ["m3-roles", "wcag-22"],
    refs: [],
    logDate: today(),
    sources: sources.map((s) => s.url),
    rationale: "Companion restraint candidate for peer craft bar.",
  };

  return [primary, secondary];
}

function offlineResearch(
  topic: string,
  notes: string,
  sources: { url: string; title: string }[]
): ResearchCandidate[] {
  const focus = topic.trim() || sources[0]?.title || "Design research pillar";
  const lines = notes
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 8)
    .slice(0, 4);
  const implications =
    lines.length > 0
      ? lines
      : [
          `Treat ${focus} as a constraint, not a skin.`,
          "Prefer roles and space over decoration.",
          "Document when to skip for utility/admin surfaces.",
        ];

  return [
    {
      id: slugify(focus),
      title: focus.slice(0, 100),
      year: new Date().getFullYear(),
      source: sources[0]?.url || "",
      implications,
      ruleDeltas: {
        "--content-policy": "plain-labels",
        "--chrome-policy": "quiet",
      },
      rationale: "Offline structure from topic/notes/URLs (no AI key).",
    },
    ...(sources.slice(1, 3).map((s, i) => ({
      id: `${slugify(s.title || focus)}-${i + 2}`,
      title: s.title.slice(0, 100),
      year: new Date().getFullYear(),
      source: s.url,
      implications: [
        `Steal systems from ${s.title}, not visual kits.`,
        "Map implications into Compose research axis.",
      ],
      ruleDeltas: { "--role-discipline": "strict-pairs" },
      rationale: "Derived from pasted source URL.",
    })) as ResearchCandidate[]),
  ];
}

async function callOpenAI(system: string, user: string) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${err.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content || null;
}

async function callAnthropic(system: string, user: string) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic error ${res.status}: ${err.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  const text = data.content?.find((c) => c.type === "text")?.text || null;
  return text;
}

function parseAiJson(raw: string) {
  const trimmed = raw.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fence?.[1] || trimmed;
  return JSON.parse(body) as { candidates?: unknown[] };
}

function normalizeTrends(raw: unknown[], sources: string[]): TrendCandidate[] {
  return raw.slice(0, 4).map((item, i) => {
    const o = item as Record<string, unknown>;
    const en = String(o.en || o.title || `Trend ${i + 1}`);
    return {
      id: slugify(String(o.id || en)),
      category: TREND_CATS.includes(String(o.category))
        ? String(o.category)
        : "platform",
      en,
      ko: String(o.ko || ""),
      what: String(o.what || en),
      when: String(o.when || "When the pattern fits product craft."),
      skip: String(o.skip || "Skip for utility-critical admin unless proven."),
      research: Array.isArray(o.research)
        ? (o.research as string[]).slice(0, 3)
        : ["apple-deference"],
      refs: Array.isArray(o.refs) ? (o.refs as string[]).slice(0, 2) : [],
      logDate: String(o.logDate || today()),
      sources: Array.isArray(o.sources)
        ? (o.sources as string[])
        : sources,
      rationale: String(o.rationale || "AI propose"),
    };
  });
}

function normalizeResearch(
  raw: unknown[],
  sources: string[]
): ResearchCandidate[] {
  return raw.slice(0, 4).map((item, i) => {
    const o = item as Record<string, unknown>;
    const title = String(o.title || `Research ${i + 1}`);
    return {
      id: slugify(String(o.id || title)),
      title,
      year: Number(o.year) || new Date().getFullYear(),
      source: String(o.source || sources[i] || sources[0] || ""),
      implications: Array.isArray(o.implications)
        ? (o.implications as string[]).slice(0, 5)
        : [String(o.what || title)],
      ruleDeltas:
        typeof o.ruleDeltas === "object" && o.ruleDeltas
          ? (o.ruleDeltas as Record<string, string>)
          : undefined,
      rationale: String(o.rationale || "AI propose"),
    };
  });
}

export async function proposeDiscover(input: {
  axis: DiscoverAxis;
  topic?: string;
  notes?: string;
}): Promise<ProposeResult> {
  const topic = (input.topic || "").trim();
  const notes = (input.notes || "").trim();
  const urls = extractUrls(`${topic}\n${notes}`);
  const sources = await Promise.all(urls.slice(0, 4).map(fetchPageHint));

  const system =
    input.axis === "trends"
      ? `You are a design director for Signal Field (quiet product UI: paper/graphite, one accent, IBM Plex, no SaaS card farms). Return JSON: {"candidates":[{id,category,en,ko,what,when,skip,research,refs,logDate,sources,rationale}]}. category one of type|color|motion|layout|platform|a11y. research ids like wcag-22,m3-roles,apple-deference,fluid-type,content-plain. 2-3 candidates. Korean ko short.`
      : `You are a design director for Signal Field. Return JSON: {"candidates":[{id,title,year,source,implications,ruleDeltas,rationale}]}. implications: 2-4 concrete bullets for product UI. 2-3 candidates. Prefer durable research pillars over fashion.`;

  const user = JSON.stringify({
    topic: topic || "what’s current in product/UI design craft",
    notes,
    fetchedSources: sources,
    today: today(),
  });

  try {
    const ai =
      (await callOpenAI(system, user)) || (await callAnthropic(system, user));
    if (ai) {
      const parsed = parseAiJson(ai);
      const list = Array.isArray(parsed.candidates) ? parsed.candidates : [];
      const provider = process.env.OPENAI_API_KEY
        ? "openai"
        : process.env.ANTHROPIC_API_KEY
          ? "anthropic"
          : undefined;
      if (input.axis === "trends") {
        return {
          mode: "ai",
          provider,
          axis: "trends",
          candidates: normalizeTrends(
            list,
            sources.map((s) => s.url)
          ),
        };
      }
      return {
        mode: "ai",
        provider,
        axis: "research",
        candidates: normalizeResearch(
          list,
          sources.map((s) => s.url)
        ),
      };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI failed";
    if (input.axis === "trends") {
      return {
        mode: "offline",
        axis: "trends",
        candidates: offlineTrends(topic, notes, sources),
        note: `AI unavailable (${message}). Offline structure used.`,
      };
    }
    return {
      mode: "offline",
      axis: "research",
      candidates: offlineResearch(topic, notes, sources),
      note: `AI unavailable (${message}). Offline structure used.`,
    };
  }

  if (input.axis === "trends") {
    return {
      mode: "offline",
      axis: "trends",
      candidates: offlineTrends(topic, notes, sources),
      note: "No OPENAI_API_KEY / ANTHROPIC_API_KEY — offline propose from topic, notes, and URLs.",
    };
  }
  return {
    mode: "offline",
    axis: "research",
    candidates: offlineResearch(topic, notes, sources),
    note: "No OPENAI_API_KEY / ANTHROPIC_API_KEY — offline propose from topic, notes, and URLs.",
  };
}
