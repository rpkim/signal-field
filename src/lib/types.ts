export type MixState = {
  research: string[];
  references: string[];
  color: string;
  type: string;
  density: string;
  trends?: string[];
};

export type SavedMix = {
  id: string;
  name: string;
  createdAt: string;
  mix: MixState;
};

export type ColorItem = {
  id: string;
  name: string;
  ko?: string;
  feeling?: string;
  when?: string;
  swatches?: string[];
  roles: Record<string, string>;
};

export type TypeItem = {
  id: string;
  name: string;
  display: string;
  body: string;
  mono?: string;
  google: string;
  fallbacks: string;
  rationale: string;
  trackingDisplay: string;
};

export type DensityItem = {
  id: string;
  name: string;
  ko?: string;
  tokens: Record<string, string>;
};

export type CatalogItem = {
  id: string;
  name?: string;
  title?: string;
  ko?: string;
  feeling?: string;
  rationale?: string;
  steal?: string;
};
