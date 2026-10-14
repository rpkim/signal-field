# Rebrand existing services

Workflow for **user-owned / authorized** sites and local app CSS: analyze the live look → map tokens onto Signal Field roles → hook an override stylesheet → preview → export a portable kit.

| | |
| --- | --- |
| **UI** | [`theme-example/rebrand.html`](./theme-example/rebrand.html) |
| **Demo fixture** | [`theme-example/rebrand-demo/`](./theme-example/rebrand-demo/) |
| **Recommend** | [`theme-example/recommend.html`](./theme-example/recommend.html) — briefs with `rebrand` / a URL also open this path |
| **Compose / export** | [`theme-example/compose.html`](./theme-example/compose.html) |
| **Map** | [`recommend-map.md`](./recommend-map.md) |

**Scope:** Only rebrand properties and CSS you are allowed to change. Do **not** bypass auth walls, scrape behind logins, or fetch credentials. Prefer paste/upload of CSS you own, or the local demo fixture.

---

## New service vs rebrand

| Path | When | Entry |
| --- | --- | --- |
| **New service** | Greenfield product brief | Recommend → Compose → export kit |
| **Rebrand existing** | Live URL and/or existing CSS/code | Rebrand tool → analyze → hook → preview → Compose export |

Agents: if the brief mentions `rebrand`, a URL, or “existing CSS”, use this doc + `rebrand.html` in addition to §1.5 recommend.

---

## Workflow

### 1. Analyze
Inputs (Mode A preferred when CORS blocks Mode B):

- **Mode A — CSS text:** paste stylesheet text, upload `.css`, or paste output from the bookmarklet.
- **Mode B — URL:** attempt `fetch(url)` when same-origin / CORS allows. If blocked, instruct paste CSS or use local files. Never claim cross-origin CSS was read when it was not.

Extractor looks for:

- Hex / `rgb()` / `rgba()` color literals (ranked by frequency)
- `font-family` declarations
- `:root` / custom properties (`--*`)
- `border-radius` values
- Soft clues: spacing scale literals (`4px`, `8px`, `16px`…)

### 2. Map tokens
Detected signals map onto Signal Field **roles** (not raw hex dumps):

| Detected | Maps toward |
| --- | --- |
| Darkest frequent color | `--color-ink` / field-deep candidate |
| Lightest frequent color | `--color-field` / chalk |
| Most chromatic mid tone | `--color-signal` family |
| Display-ish / heading font | type option (`plex`, `plex`, …) |
| Common radius | density (`default` / `comfortable` / `a11y-large`) |

Recommend-map domains still apply (fintech → ledger, commerce → kiln, a11y → clear-ink, etc.). Analysis can **complement** the old look (same temperature, calmer) or **contrast** intentionally (e.g. clear utility over purple neon).

### 3. Hook
Generate `rebrand-hook.css` that:

1. Declares Signal Field role tokens for the chosen mix (`color` + `type` + `density`).
2. Remaps **detected** `:root` vars onto those roles when names look brand-like (`--primary`, `--brand`, `--accent`, `--bg`, …).
3. Applies calm body/link/focus defaults as a safety net.

Drop the file into the app after existing stylesheets, or inject into the preview iframe.

### 4. Preview
- **Fixture / same-origin:** iframe loads `rebrand-demo/` (or allowed URL) and injects the hook stylesheet.
- **CORS / opaque remote:** show side-by-side “extracted sample chrome” restyled with new tokens + downloadable hook CSS for the user’s app.
- Live remote preview without CORS is **not guaranteed** — document the failure and fall back.

### 5. Export kit
Open Compose with the chosen mix (deep-link query params) → download `DESIGN.md` + CSS → optional `brand-kits/_generated/<slug>/`.

---

## Limits

| Limit | Guidance |
| --- | --- |
| Cross-origin CSS | Browsers block reading foreign stylesheets; paste CSS or use local path |
| Auth-walled apps | User pastes CSS from DevTools / source they control |
| Computed styles | Bookmarklet can sample `:root` + a few computed properties for paste-back |
| Perfect visual parity | Hook remaps tokens/roles — layout quirks remain until the app adopts the kit |
| Scraping | Out of scope |

---

## Bookmarklet (paste-back)

Run on a page you own (same tab). Copies a CSS snapshot for Mode A:

```js
javascript:void((()=>{const r=getComputedStyle(document.documentElement);const keys=[...document.styleSheets].flatMap(s=>{try{return[...s.cssRules].flatMap(rule=>rule.style?[...rule.style]:[])}catch(e){return[]}});const vars=[...new Set(keys)].filter(k=>k.startsWith('--')).map(k=>`${k}:${r.getPropertyValue(k).trim()};`).join('\n');const body=getComputedStyle(document.body);const out=`:root{\n${vars}\n}\nbody{font-family:${body.fontFamily};background:${body.backgroundColor};color:${body.color};}`;navigator.clipboard.writeText(out).then(()=>alert('Signal Field rebrand snapshot copied'));})();
```

---

## Agent checklist

- [ ] Confirmed user owns / is authorized to restyle the target
- [ ] CSS obtained via paste, upload, same-origin fetch, or bookmarklet — not auth bypass
- [ ] Analysis recorded: palette, fonts, radii, `:root` vars
- [ ] Mix chosen (recommend + analysis lean) with rationale
- [ ] `rebrand-hook.css` generated and previewed (fixture or iframe)
- [ ] Compose export path / kit folder recorded
- [ ] Limits explained if remote preview failed
