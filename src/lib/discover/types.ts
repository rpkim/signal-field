export type DiscoverAxis = "trends" | "research";

export type TrendCandidate = {
  id: string;
  category: string;
  en: string;
  ko: string;
  what: string;
  when: string;
  skip: string;
  research: string[];
  refs: string[];
  logDate: string;
  sources?: string[];
  rationale?: string;
  tokenDeltas?: Record<string, string>;
};

export type ResearchCandidate = {
  id: string;
  title: string;
  year: number;
  source: string;
  implications: string[];
  ruleDeltas?: Record<string, string>;
  rationale?: string;
};

export type ProposeResult = {
  mode: "ai" | "offline";
  provider?: string;
  axis: DiscoverAxis;
  candidates: TrendCandidate[] | ResearchCandidate[];
  note?: string;
};
