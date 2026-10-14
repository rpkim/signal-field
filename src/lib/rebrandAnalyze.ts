export type Analysis = {
  colors: { hex: string; count: number }[];
  vars: Record<string, string>;
  fonts: string[];
  radii: string[];
  map: { ink: string; field: string; signal: string };
  defaultBlueSaaS: boolean;
  purpleHeavy: boolean;
  cssLength: number;
};

function normalizeHex(h: string) {
  let s = h.toLowerCase();
  if (s.length === 4) s = "#" + s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
  return s;
}

function luminance(hex: string) {
  const h = normalizeHex(hex).slice(1);
  const to = (i: number) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * to(0) + 0.7152 * to(2) + 0.0722 * to(4);
}

function chroma(hex: string) {
  const h = normalizeHex(hex).slice(1);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return Math.max(r, g, b) - Math.min(r, g, b);
}

export function analyzeCss(css: string): Analysis {
  const colorCounts: Record<string, number> = {};
  const bump = (hex: string) => {
    const n = normalizeHex(hex);
    colorCounts[n] = (colorCounts[n] || 0) + 1;
  };

  (css.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/g) || []).forEach(bump);

  const vars: Record<string, string> = {};
  (css.match(/:root\s*\{[^}]*\}/gi) || []).forEach((block) => {
    const body = block.replace(/^:root\s*\{/i, "").replace(/\}$/, "");
    body.split(";").forEach((line) => {
      const m = line.match(/(--[\w-]+)\s*:\s*([^;]+)/);
      if (m) vars[m[1].trim()] = m[2].trim();
    });
  });
  Object.values(vars).forEach((v) => {
    if (v.startsWith("#")) bump(v);
  });

  const fonts: string[] = [];
  (css.match(/font-family\s*:\s*([^;!}{]+)/gi) || []).forEach((line) => {
    const fam = line.split(":")[1].trim();
    if (fam && !fonts.includes(fam)) fonts.push(fam);
  });

  const radii: string[] = [];
  (css.match(/border-radius\s*:\s*([^;!}{]+)/gi) || []).forEach((line) => {
    const val = line.split(":")[1].trim();
    if (val && !radii.includes(val)) radii.push(val);
  });

  const ranked = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([hex, count]) => ({
      hex,
      count,
      lum: luminance(hex),
      chroma: chroma(hex),
    }));

  const darkest = [...ranked].sort((a, b) => a.lum - b.lum)[0];
  const lightest = [...ranked].sort((a, b) => b.lum - a.lum)[0];
  const accent =
    [...ranked].filter((c) => c.chroma > 40).sort((a, b) => b.chroma - a.chroma)[0] ||
    ranked[0];

  const purpleHeavy = ranked.some((c) => {
    const h = c.hex.slice(1);
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return b > r + 20 && b > g + 20 && c.chroma > 50;
  });
  const defaultBlueSaaS = ranked.some((c) => {
    const h = c.hex.slice(1);
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return b > 180 && b > r + 40 && b > g && c.chroma > 60;
  });

  return {
    colors: ranked.slice(0, 12).map(({ hex, count }) => ({ hex, count })),
    vars,
    fonts,
    radii,
    map: {
      ink: darkest?.hex || "#12141a",
      field: lightest?.hex || "#f6f7f8",
      signal: accent?.hex || "#0f766e",
    },
    purpleHeavy,
    defaultBlueSaaS,
    cssLength: css.length,
  };
}

export function buildHookCss(
  analysis: Analysis,
  roles: Record<string, string>
) {
  const lines = [
    `/* Signal Field rebrand-hook.css */`,
    `:root {`,
  ];
  Object.entries(roles).forEach(([k, v]) => lines.push(`  ${k}: ${v};`));
  Object.keys(analysis.vars).forEach((name) => {
    if (/primary|brand|accent|signal/i.test(name))
      lines.push(`  ${name}: var(--color-ink);`);
    else if (/bg|background|field|surface/i.test(name))
      lines.push(`  ${name}: var(--color-field);`);
    else if (/text|ink|muted/i.test(name))
      lines.push(`  ${name}: var(--color-ink-soft);`);
    else if (/radius/i.test(name)) lines.push(`  ${name}: var(--radius-md, 0.375rem);`);
    else if (/font|family/i.test(name)) lines.push(`  ${name}: var(--font-body);`);
  });
  lines.push(`}`);
  lines.push(`body { font-family: var(--font-body) !important; background: var(--color-field) !important; color: var(--color-ink) !important; }`);
  lines.push(`.cta, button { background: var(--color-ink) !important; color: var(--color-chalk) !important; border-radius: var(--radius-md, 0.375rem) !important; box-shadow: none !important; }`);
  lines.push(`.card, .table { box-shadow: none !important; border-color: var(--color-hairline) !important; border-radius: var(--radius-md, 0.375rem) !important; }`);
  return lines.join("\n");
}
