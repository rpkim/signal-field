import type { ColorItem, DensityItem, MixState, TypeItem } from "./types";

export function buildTokensCss(
  mix: MixState,
  color: ColorItem,
  type: TypeItem,
  density: DensityItem
) {
  const roles = { ...color.roles, ...density.tokens };
  const lines = [
    `/* Signal Field mix · color=${mix.color} type=${mix.type} density=${mix.density} */`,
    type.google
      ? `@import url("https://fonts.googleapis.com/css2?${type.google}&display=swap");`
      : null,
    `:root {`,
    `  --font-display: "${type.display}", ${type.fallbacks};`,
    `  --font-body: "${type.body}", ${type.fallbacks};`,
    type.mono
      ? `  --font-mono: "${type.mono}", ui-monospace, Menlo, monospace;`
      : `  --font-mono: ui-monospace, Menlo, monospace;`,
    `  --tracking-display: ${type.trackingDisplay};`,
    `  --bp-sm: 40rem; /* 640 — compact */`,
    `  --bp-md: 48rem; /* 768 — tablet */`,
    `  --bp-lg: 60rem; /* 960 — tools two-column */`,
    `  --bp-xl: 75rem; /* 1200 — wide */`,
    `  --touch-min: 44px;`,
    `  --page-gutter: clamp(1.25rem, 4vw, 2.75rem);`,
    `  --content-max: 68rem;`,
    `  --measure: 36rem;`,
    `  --text-xs: 0.6875rem;`,
    `  --text-sm: 0.8125rem;`,
    `  --text-base: 1rem;`,
    `  --text-md: 1.125rem;`,
    `  --text-lg: 1.375rem;`,
    `  --text-xl: clamp(1.75rem, 1.5vw + 1.25rem, 2.125rem);`,
    `  --text-hero: clamp(2.25rem, 3vw + 1.25rem, 3.25rem);`,
    `  --leading-tight: 1.1;`,
    `  --leading-snug: 1.3;`,
    `  --leading-body: 1.6;`,
    `  --radius-sm: 0.25rem;`,
    `  --radius-md: 0.375rem;`,
    `  --elev-focus: 0 0 0 2px #fff, 0 0 0 4px var(--color-focus, #0f766e);`,
    `  --color-hairline: rgb(18 20 26 / 0.1);`,
  ].filter(Boolean) as string[];
  Object.entries(roles).forEach(([k, v]) => {
    lines.push(`  ${k}: ${v};`);
  });
  lines.push(`}`);
  return lines.join("\n") + "\n";
}

export function buildThemeCss() {
  return `/* Signal Field theme.css — base application layer. Import after tokens.css */
@import url("tokens.css");

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-body);
  color: var(--color-ink);
  background: var(--color-field);
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--color-ink);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.18em;
}

a:hover {
  color: var(--color-signal-deep);
}

:focus-visible {
  outline: none;
  box-shadow: var(--elev-focus);
}

button,
input,
select,
textarea {
  font: inherit;
}

.sf-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--touch-min, 44px);
  min-width: var(--touch-min, 44px);
  padding: 0.55rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  background: var(--color-ink);
  color: var(--color-chalk);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
}

.sf-btn--ghost {
  background: transparent;
  border-color: var(--color-hairline);
  color: var(--color-ink);
}

@media (max-width: 39.99rem) {
  body {
    /* compact: keep gutters via --page-gutter */
  }
}
`;
}

export function buildKitDesignMd(
  mix: MixState,
  color: ColorItem,
  type: TypeItem,
  density: DensityItem
) {
  return [
    `# Kit DESIGN.md`,
    ``,
    `This kit was exported from Signal Field Compose.`,
    `**System rules:** follow \`SIGNAL-FIELD-design.md\` (full guidelines) in this zip.`,
    ``,
    `## Mix`,
    ``,
    `| Axis | Id |`,
    `| --- | --- |`,
    `| Research | ${mix.research.join(", ") || "—"} |`,
    `| References | ${mix.references.join(", ") || "—"} |`,
    `| Trends | ${(mix.trends || []).join(", ") || "—"} |`,
    `| Color | \`${mix.color}\` — ${color.name} |`,
    `| Type | \`${mix.type}\` — ${type.name} |`,
    `| Density | \`${mix.density}\` — ${density.name} |`,
    ``,
    `## Wire-up`,
    ``,
    `1. Copy this folder into your repo (e.g. \`styles/signal-field/\`).`,
    `2. Import **tokens.css** then **theme.css** (theme already \`@import\`s tokens — or link both).`,
    `3. Give implementing agents \`SIGNAL-FIELD-design.md\` + this kit.`,
    ``,
    `## Color feeling`,
    ``,
    `${color.when || color.feeling || "—"}`,
    ``,
    `## Type rationale`,
    ``,
    `${type.rationale}`,
    ``,
  ].join("\n");
}

/** @deprecated use buildKitDesignMd — kept for callers expecting mix-only md */
export function buildDesignMd(mix: MixState) {
  return [
    `# Signal Field mix`,
    ``,
    `| Axis | Id |`,
    `| --- | --- |`,
    `| Research | ${mix.research.join(", ") || "—"} |`,
    `| References | ${mix.references.join(", ") || "—"} |`,
    `| Trends | ${(mix.trends || []).join(", ") || "—"} |`,
    `| Color | \`${mix.color}\` |`,
    `| Type | \`${mix.type}\` |`,
    `| Density | \`${mix.density}\` |`,
    ``,
    `See SIGNAL-FIELD-design.md + tokens.css + theme.css in the export zip.`,
    ``,
  ].join("\n");
}

export function buildKitReadme(mix: MixState) {
  return [
    `# Signal Field kit export`,
    ``,
    `## One download = three core files`,
    ``,
    `| File | Role |`,
    `| --- | --- |`,
    `| \`SIGNAL-FIELD-design.md\` | Full system guidelines (must follow) |`,
    `| \`tokens.css\` | CSS variables for this mix |`,
    `| \`theme.css\` | Base application layer (\`@import\` tokens) |`,
    ``,
    `Also in this zip: \`DESIGN.md\` (mix citation), \`mix.json\`, \`README.md\`.`,
    ``,
    `## Import order`,
    ``,
    `\`\`\`html`,
    `<link rel="stylesheet" href="./tokens.css" />`,
    `<link rel="stylesheet" href="./theme.css" />`,
    `\`\`\``,
    ``,
    `Or only \`theme.css\` if it \`@import\`s tokens (default).`,
    ``,
    `## Mix ids`,
    ``,
    `- color: \`${mix.color}\``,
    `- type: \`${mix.type}\``,
    `- density: \`${mix.density}\``,
    `- research: ${mix.research.join(", ") || "—"}`,
    `- references: ${mix.references.join(", ") || "—"}`,
    `- trends: ${(mix.trends || []).join(", ") || "—"}`,
    ``,
  ].join("\n");
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadText(filename: string, text: string, mime = "text/plain") {
  downloadBlob(filename, new Blob([text], { type: `${mime};charset=utf-8` }));
}
