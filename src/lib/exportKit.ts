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
    `:root {`,
    `  --font-display: "${type.display}", ${type.fallbacks};`,
    `  --font-body: "${type.body}", ${type.fallbacks};`,
    type.mono
      ? `  --font-mono: "${type.mono}", ui-monospace, Menlo, monospace;`
      : `  --font-mono: ui-monospace, Menlo, monospace;`,
    `  --tracking-display: ${type.trackingDisplay};`,
  ];
  Object.entries(roles).forEach(([k, v]) => {
    lines.push(`  ${k}: ${v};`);
  });
  lines.push(`}`);
  return lines.join("\n");
}

export function buildDesignMd(mix: MixState) {
  return [
    `# Signal Field mix`,
    ``,
    `| Axis | Id |`,
    `| --- | --- |`,
    `| Research | ${mix.research.join(", ") || "—"} |`,
    `| References | ${mix.references.join(", ") || "—"} |`,
    `| Color | \`${mix.color}\` |`,
    `| Type | \`${mix.type}\` |`,
    `| Density | \`${mix.density}\` |`,
    ``,
    `Export from Compose. Apply tokens.css after your base styles.`,
    ``,
  ].join("\n");
}

export function downloadText(filename: string, text: string, mime = "text/plain") {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
