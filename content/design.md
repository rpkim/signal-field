# Signal Field — Design guidelines

Staff design guideline for UI work in this Project. Normative language: **must** / **should** / **never**.

| Item | Value |
| --- | --- |
| System | Signal Field |
| Status | Canonical |
| Example demo brand | Northline Studio (thin sample identity only — not a product brand) |
| Product app (Next.js) | [`rpkim/signal-field`](https://github.com/rpkim/signal-field) · routes `/`, `/compose`, `/trends`, `/research`, `/doc` |
| Usage playbook | [`USAGE.md`](./USAGE.md) (humans + agents) |
| Legacy static proof | `docs/theme-example/` (superseded for tools by the Next app) |
| Brand kits (export) | `docs/brand-kits/<kit-id>/` |
| Research | [`design-research.md`](./design-research.md) · [`references.md`](./references.md) |
| Adapters | `tokens.css`, `theme.css` (kit export) · app `src/styles/tokens.css` · Tailwind snippet in kits |

**How agents use this document**
1. Read §1 Philosophy and apply the checklist. Full playbook: [`USAGE.md`](./USAGE.md).
2. Given a **service / product brief**, run the recommend path (§1.5): read [`recommend-map.md`](./recommend-map.md) + `brand-options/*`, return **1 primary mix + 2 alts** with rationale, then open `/compose`.
3. If the brief is an **existing product**, still use Recommend → Compose → kit export. Applying `design.md` + kit CSS **is** the rebrand (no separate Rebrand menu).
4. **Compose** the chosen mix (§1.4) in Next `/compose` (deep-link from Recommend / Doc saved mixes) — or load a preset — then export `DESIGN.md` + CSS; default starting mix ≈ `precise-quiet`.
5. Optionally align appearance (§8) with the color recipe chosen.
6. Build with foundations (§2, including Responsive §2.4) and component specs (§4).
7. Map to platform (§7). Browse Trends via Next `/trends` + `brand-options/trends.json`; append the technical log (§9) only when asked for fashion — never rewrite core principles.

**What to give an implementing agent (short answer)**  
Attach or link **this `design.md`** plus the **exported kit** (`DESIGN.md`, `tokens.css`, `theme.css` — import order in USAGE). Not random CSS alone.

---

## 1. Philosophy

### 1.1 Meta-principles (clarity · deference · depth)

Adapted for product UI (shape only — not a copy of any vendor guide).

| Principle | Meaning | Must | Never |
| --- | --- | --- | --- |
| **Clarity** | Content and action are legible at a glance | Sufficient contrast; one primary action per region; type roles used correctly | Decorative type that reduces reading; low-contrast icons as sole affordance |
| **Deference** | UI chrome yields to content and brand signal | Quiet chrome; brand/product name at appropriate strength for the surface | Chrome that outranks content; competing accents |
| **Depth** | Hierarchy via space, type, and restrained elevation — not ornament | Consistent z-order and focus order | Glow stacks, multi-shadow “premium” kits, floating badge clutter |

### 1.2 Ten product principles

Numbered principles for Signal Field. Each includes meaning, do, don’t, and an agent check.

#### P1 — Useful
- **Meaning:** Every element earns its place by helping a user complete a task or understand content.
- **Do:** Prefer one clear job per section; remove anything that does not serve that job.
- **Don’t:** Add stats, promo chips, or “atmosphere widgets” that do not support the task.
- **Agent:** Can you delete this block without harming the task? If yes, delete it.

#### P2 — Honest
- **Meaning:** Visual weight matches importance; interactive elements look interactive.
- **Do:** Use signal color for primary actions and focus; use semantic status colors only for status.
- **Don’t:** Style marketing copy like a button; fake affordances.
- **Agent:** Would a user expect a click here? If unsure, make it quieter or make it a real control.

#### P3 — Understandable
- **Meaning:** Structure and labels are obvious without decoration explaining them.
- **Do:** Use standard patterns (nav, form, dialog); label controls in plain language.
- **Don’t:** Invent novel gestures for common tasks; hide primary actions behind icon-only mystery meat on first use.
- **Agent:** Can a new user name the page’s purpose in one sentence from the first viewport?

#### P4 — Unobtrusive
- **Meaning:** Brand and chrome support content; they do not perform.
- **Do:** Restrain motion (2–3 purposeful moments on visually led pages); keep accents singular.
- **Don’t:** Continuous animation on chrome; neon/glow as identity; emoji as decoration.
- **Agent:** Turn motion off (`prefers-reduced-motion`). Does hierarchy still hold?

#### P5 — Aesthetic (through order)
- **Meaning:** Beauty comes from proportion, type, and calm fields — not from trend kits.
- **Do:** Align to the 8pt scale; keep one type pairing; one accent family.
- **Don’t:** Purple-on-white gradients; cream + terracotta + display-serif cliché; broadsheet hairline pastiche.
- **Agent:** Remove the nav. Does the first screen still feel intentional and on-brand?

#### P6 — Thorough down to detail
- **Meaning:** States, focus, empty, error, and loading are specified — not afterthoughts.
- **Do:** Define default / hover / active / focus / disabled / error for interactive components.
- **Don’t:** Ship primary buttons without `:focus-visible`; leave destructive actions unlabeled.
- **Agent:** Tab through the flow. Is focus always visible and logical?

#### P7 — Long-lasting
- **Meaning:** Core principles and token *roles* outlive seasonal fashion.
- **Do:** Put fashion in §9 Trends or §8 appearance deltas; keep roles stable.
- **Don’t:** Silently rename roles or swap the accent meaning per page.
- **Agent:** Would this still make sense in 18 months without the current trend?

#### P8 — Environmentally considerate (digital)
- **Meaning:** Prefer efficient assets and restrained effects.
- **Do:** Prefer CSS atmosphere over huge video heroes when equivalent; respect reduced motion.
- **Don’t:** Autoplay heavy media as default decoration.
- **Agent:** Is there a lighter equivalent that keeps clarity?

#### P9 — As little design as possible
- **Meaning:** Subtract until meaning breaks, then stop.
- **Do:** Default to no cards; no hero overlays; one CTA group in first viewport.
- **Don’t:** Pill clusters, icon rows, boxed promos, multi-layer shadows.
- **Agent:** List every visible element in the first viewport. Anything outside brand / headline / lede / CTA / one plane?

#### P10 — Consistent across surfaces
- **Meaning:** Website, app, HTML export, and print share roles; density and motion adapt.
- **Do:** Use adapters; keep `--color-signal` as the single accent role.
- **Don’t:** Fork a second palette meaning per framework.
- **Agent:** Name the surface and the appearance mode before coding.

### 1.3 Anti-patterns (never ship)

| Cluster | Why |
| --- | --- |
| Purple → indigo on white | Generic AI default |
| Warm cream (~`#F4F1EA`) + terracotta + display serif | Cliché “tasteful” stack |
| Broadsheet hairlines + dense newspaper columns | Parody editorial, not our system |
| Glow / neon / glassmorphism card farms | Ornament over order |
| Inter / Roboto / Arial / system-ui as the *expressive* face | Default stack — use the kit’s pairing |
| Novelty display faces (Syne, Figtree, Inter) as system default | AI-template type — use IBM Plex Sans weight scale |

### 1.4 Branding

Branding is first-class. **Apply by composing options** (research × references × color × type × density) → **export a portable kit**. Mood words alone are not enough.

**Existing product:** same path — apply `design.md` + Compose kit (that is the rebrand)  
**Primary compose UI:** Next `/compose` (expanded color/type/density; Save → `/doc`)  
**Option catalogs:** `src/data/` (colors · type · density · presets) synced from store `docs/brand-options/`  
**Trends / Research:** button-only AI discover (`/trends`, `/research`) → auto-add → Compose 업데이트 반영  
**Presets (saved mixes):** six kits under `docs/brand-kits/` · Compose presets  
**Generated mixes:** `docs/brand-kits/_generated/<slug>/` · Compose Download kit

#### Brand signal
| Element | Rule |
| --- | --- |
| Accent | One family (`--color-signal` / bright / deep). Never a second brand purple. |
| Wordmark | Display face; Title strength in product chrome; Display strength only when hero brand is required. |
| Voice | Short, concrete, calm. No emoji chrome. |
| Photography | Real product/place/atmosphere; no sticker overlays on hero media. |
| Identity demo | Sample names in examples are disposable — replace with the real product brand when shipping. |

#### Compose axes
| Axis | Catalog | Select | What it changes |
| --- | --- | --- | --- |
| Research | `brand-options/research.json` | multi ≤3 | Implications + optional CSS rule deltas (focus, motion, roles) |
| References | `brand-options/references.json` | multi ≤2 | Cited steal/don’t; visual lean notes in DESIGN.md |
| Color | `brand-options/colors.json` | one | Color role hex recipes |
| Type | `src/data/type.json` (default/`recommended`: `plex`) | one | Display/body pairing + tracking; Google load for selected only |
| Density | `brand-options/density.json` | one | Radius, section space, base size |

#### Mix → export (must)
1. Choose options (or load a preset mix).
2. Merge color + type + density tokens; apply research CSS deltas; list all citations.
3. Emit: `DESIGN.md` (cites every option id) · `tokens.css` · `theme.css` · `sample.html` · `print.css` · Tailwind snippet · `README.md`.
4. Hand off the folder path or downloaded files for use in another repo.

#### 1.5 Service → theme recommend (agent pattern)

When the user describes a **service / product** (KO or EN):

1. Read [`recommend-map.md`](./recommend-map.md) and score domain keywords against the brief.
2. New or existing product: same recommend path. For existing UIs, the handoff is still `design.md` + kit — applying it is the rebrand.
3. Return **primary + 2 alternatives** with: kit id *or* composed option ids (`color` · `type` · `density` · `research` · `references`), trend tags, and a short why (color/type/feeling).
4. Point humans to Apply: `/compose?color=…&type=…&density=…` (optional `preset=`, `research=`, `references=`, `save=`).
5. Export from Compose → download kit zip or `brand-kits/_generated/<slug>/`.

UI heuristics live in the Next app `src/lib/recommend.ts` (and legacy `theme-example/recommend.js`) and must stay aligned with `recommend-map.md`.

#### Presets (optional shortcuts)
| Preset ID | Typical mix |
| --- | --- |
| `precise-quiet` | signal-teal · plex · default · wcag+m3+fluid · ibm |
| `day-editorial` | day-mist · plex · comfortable |
| `warm-commerce` | kiln-copper · outfit-source · comfortable · polaris |
| `utility-clear` | clear-ink · plex · a11y-large · govuk |
| `soft-product` | soft-sage · jakarta · comfortable |
| `ink-ledger` | ledger-slate · grotesk-source · compact |

#### Portable kit contents
| File | Purpose |
| --- | --- |
| `DESIGN.md` | Brief + **mix citation table** + token tables |
| `tokens.css` | CSS variables (+ font import, system fallbacks) |
| `theme.css` | Minimal samples |
| `sample.html` | Standalone preview |
| `tailwind.theme.snippet.js` | Tailwind extend map |
| `print.css` | Print/PDF |
| `mix.json` | Machine-readable selection (generated mixes) |
| `README.md` | Drop-in steps |

#### Do / Don’t (branding)
| Do | Don’t |
| --- | --- |
| Mix axes then export concrete files | Ship vibes without tokens |
| Cite research/ref ids in `DESIGN.md` | Hide which options were chosen |
| Keep role names stable across mixes | Fork `--color-signal` meaning |
| Use presets only as starting points | Treat presets as the only path |
| Keep one accent | Purple / cream-terracotta-serif / broadsheet kits |

---

## 2. Foundations

Token **names** are stable. Appearance modes (§8) override **values**. Canonical CSS: kit `tokens.css` + `theme.css` · Next app `src/styles/tokens.css` · legacy `theme-example/tokens.css` + `themes.css`.

### 2.1 Color roles

Use roles in UI decisions. Hex values are implementation detail for the active appearance.

| Role | CSS | Purpose |
| --- | --- | --- |
| Ink | `--color-ink` | Primary text on light surfaces |
| Ink soft | `--color-ink-soft` | Secondary text on light |
| Chalk | `--color-chalk` | Primary text on dark surfaces |
| Field | `--color-field` | Page / canvas background (light) |
| Field mid | `--color-field-mid` | Dividers, subtle bands |
| Field deep | `--color-field-deep` | Dark bands / inverse surfaces |
| Signal | `--color-signal` | Primary accent — actions, key links |
| Signal bright | `--color-signal-bright` | Hover / highlight |
| Signal deep | `--color-signal-deep` | Pressed / print-safe |
| Focus | `--color-focus` | Focus ring (may match signal or a11y blue in Clearline) |
| OK / Warn / Danger | `--color-ok` / `--warn` / `--danger` | Status only — never substitute for brand accent |
| Hairline | `--color-hairline` | Borders on light |
| On-hero | `--color-on-hero` | Foreground on hero/inverse planes |

**Rules**
- **Must** use one accent family (signal) for brand chroma.
- **Must** keep body text as ink/chalk — not signal.
- **Never** invent a second brand purple.

Default (`signal`) reference values:

```css
--color-ink: #0b1220;
--color-ink-soft: #243044;
--color-chalk: #f3f6fa;
--color-field: #e7eef6;
--color-field-mid: #c5d3e3;
--color-field-deep: #101a2b;
--color-signal: #129a90;
--color-signal-bright: #3dcfbf;
--color-signal-deep: #0b6e67;
```

### 2.2 Typography

**Recommended default:** **IBM Plex Sans** (`plex`) for UI/body/brand (weight scale) · **IBM Plex Mono** for tokens/code.  
Compose exposes a broader type catalog (product · geometric · humanist · editorial · mono). The **recommended** option stays selected until the user picks another.  
Do **not** default to Syne, Figtree, Inter, or other novelty/AI-template faces for the system shell.

| Role | Token | Size | Weight | Use |
| --- | --- | --- | --- | --- |
| Display | `--text-hero` | `clamp(2.25rem, 3vw + 1.25rem, 3.25rem)` | 500 | Rare large titles — same family |
| Title | `--text-xl` | `clamp(1.75rem, 1.5vw + 1.25rem, 2.125rem)` | 500 | Page titles |
| Title sm | `--text-lg` | `1.375rem` | 500 | Subsections |
| Body lg | `--text-md` | `1.125rem` | 400–500 | Ledes |
| Body | `--text-base` | `1rem` | 400 | Default UI copy |
| Label | `--text-sm` | `0.8125rem` | 500 | Controls, nav, meta |
| Caption | `--text-xs` | `0.6875rem` | 500 | Fine print |
| Mono | `--font-mono` | inherit | 400–500 | Tokens, code |

| Metric | Token | Value |
| --- | --- | --- |
| Leading tight | `--leading-tight` | 1.1 |
| Leading snug | `--leading-snug` | 1.3 |
| Leading body | `--leading-body` | 1.6 |
| Tracking display | `--tracking-display` | -0.015em |
| Measure | `--measure` | 34–36rem |

**Rules**
- **Must** use Title/Body roles for product UI; Display only when brand strength is required.
- **Never** stack three families.
- **Should** keep line length near `--measure` for long reading.

### 2.3 Spacing (8pt system)

Base unit **8px**. Prefer multiples of 8; use 4px (`--space-1`) only for tight control padding.

| Token | Rem | px @16 | Use |
| --- | --- | --- | --- |
| `--space-1` | 0.25 | 4 | Icon gaps, chip pad |
| `--space-2` | 0.5 | 8 | Compact stacks |
| `--space-3` | 0.75 | 12 | Control internal |
| `--space-4` | 1 | 16 | Default gap |
| `--space-5` | 1.5 | 24 | Group gap |
| `--space-6` | 2 | 32 | Block gap |
| `--space-7` | 3 | 48 | Section internals |
| `--space-8` | 4.5 | 72 | Large breaks |
| `--space-9` | 6 | 96 | Rare major breaks |
| `--space-section` | clamp(4rem, 8vw, 7rem) | — | Section vertical padding |
| `--page-gutter` | clamp(1.25rem, 4vw, 3rem) | — | Horizontal page inset |

### 2.4 Responsive / layout (first-class)

Responsive layout is a **foundation**, not a polish pass. The Signal Field product shell and every exported kit **must** be designed mobile-first and verified at the breakpoints below. Irony is not a design strategy: if the guidelines site wraps poorly, the system failed.

#### Breakpoint tokens

| Token | Value | Name | Intent |
| --- | --- | --- | --- |
| `--bp-sm` | `40rem` (640px) | Compact | Single column; nav collapses; tools stack |
| `--bp-md` | `48rem` (768px) | Tablet | Comfortable single column; optional two-up lists |
| `--bp-lg` | `60rem` (960px) | Guide / tools | Two-column guide layouts; Compose side specimen |
| `--bp-xl` | `75rem` (1200px) | Wide | Max content width; generous gutters |

Export kits **should** include these tokens in `tokens.css`. Media queries **should** reference the same steps (CSS cannot `var()` inside `@media` in all engines — document the rem/px pairs next to the tokens).

| Token / rule | Value |
| --- | --- |
| Content max | `--content-max: 68rem` |
| Page gutter | `--page-gutter: clamp(1.25rem, 4vw, 2.75rem)` |
| Measure | `--measure: 36rem` (long reading) |
| Columns | Fluid single column by default; conceptual 12-col only ≥ `--bp-lg` |

#### Type across viewports

- **Must** scale display/title with `clamp` (see §2.2) — never fixed `px` heroes that overflow 320px viewports.
- **Must** keep body ≥ 1rem on small screens; density `a11y-large` raises floors further.
- **Should** reduce section vertical rhythm one step on compact (`--space-8` → `--space-7`) without collapsing hierarchy.
- **Never** shrink tap labels below `--text-sm` for primary nav or primary actions.

#### Touch targets

- **Must** keep interactive targets ≥ **44×44 CSS px** (WCAG 2.2), including icon-only controls.
- **Must** keep focus rings visible and not clipped by `overflow: hidden` on sticky chrome.
- **Should** increase hit padding on compact nav rows rather than packing more links.

#### Navigation collapse

| Viewport | Behavior |
| --- | --- |
| `< --bp-lg` | Brand + menu toggle; primary links in a stacked panel (not a wrapping chip farm) |
| `≥ --bp-lg` | Inline primary nav; group separators allowed |
| All | Brand remains readable; current page marked with `aria-current` |

- **Must not** overflow horizontal nav off-screen or into unreadably wrapped multi-rows of 8+ links.
- **Must** trap focus sensibly in the open mobile panel; Escape closes.
- **Never** hide the only path to Compose/Recommend behind “more” without a visible control.

#### Tool layouts (Compose / Recommend / Discover)

| Viewport | Compose | Other tools |
| --- | --- | --- |
| `< --bp-lg` | Controls full width; **live specimen stacks below** | Single column |
| `≥ --bp-lg` | Controls + sticky specimen (~22rem) | Specimens / lists as needed |

- **Must** avoid horizontal crush: no forced side-by-side tables of options on compact.
- **Should** keep Save / Sync / Download actions in a wrapping toolbar with ≥ 44px targets.
- **Never** rely on desktop-only hover to reveal Accept/Reject or Sync.

#### Home & lists

- Home index rows **must** stack kicker above title below `--bp-sm` (already preferred).
- Spec tables **must** sit in `overflow-x: auto` wrappers; **should** prefer definition lists on compact when columns exceed three.
- **Never** set fixed widths that exceed `100vw` (including specimens, iframes, swatch rows).

#### Must / should / never (summary)

| | |
| --- | --- |
| **Must** | Ship usable layout at 320–1280px; collapse nav; stack Compose specimen; include breakpoint tokens in kits |
| **Should** | Verify tablet (`--bp-md`) as its own pass; keep reading measure; honor `prefers-reduced-motion` while resizing |
| **Never** | Desktop-only guidelines chrome; overflowing link rows; horizontal scroll of the whole page; “mobile afterthought” densification that destroys hierarchy |

### 2.5 Radius

| Token | Value | Use |
| --- | --- | --- |
| `--radius-sm` | 0.375rem | Chips, small controls |
| `--radius-md` | 0.75rem | Buttons, inputs, interactive cards |
| `--radius-lg` | 1.25rem | Rare large surfaces |
| `--radius-pill` | 999px | True toggles only — **never** marketing pill clusters |

Clearline tightens sm/md/lg for a more utilitarian feel.

### 2.6 Elevation & z

| Level | Token | Use |
| --- | --- | --- |
| 0 | `--elev-0` | Flat (default) |
| 1 | `--elev-1` | Hairline lift / list separators |
| 2 | `--elev-2` | Transient surfaces (menus, popovers) sparingly |
| Focus | `--elev-focus` | Focus ring only |

| z | Role |
| --- | --- |
| 0 | Content |
| 5 | Sticky/absolute chrome on page |
| 20 | Popover / menu |
| 40 | Modal |
| 50 | Grain overlay (non-interactive) |

**Prefer** hairline borders over shadow. **Never** stack multiple drop shadows for “depth theater.”

### 2.7 Motion

| Token | Value |
| --- | --- |
| `--dur-1` | 160ms — control feedback |
| `--dur-2` | 320ms — panel / theme |
| `--dur-3` | 700ms — rare entrance |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--ease-soft` | `cubic-bezier(0.4, 0, 0.2, 1)` |

**Must** honor `prefers-reduced-motion: reduce` (disable non-essential animation). **Should** limit visually led pages to 2–3 intentional motions. **Never** loop decorative pulses on chrome.

### 2.8 Accessibility

Grounded in WCAG 2.2 (see [`design-research.md`](./design-research.md)). Norms:

| Rule | Norm |
| --- | --- |
| Contrast | Body text **must** meet WCAG AA against its surface |
| Focus visible | **Must** show `:focus-visible` with `--elev-focus` (≥ ~2px-effective ring, strong contrast change); never remove without replacement |
| Focus not obscured | Sticky chrome **must not** fully hide the focused control (prefer `scroll-padding`) |
| Hit target | **Must** meet ≥ 24×24 CSS px (WCAG 2.5.8); **should** use ≥ 44×44 for primary controls |
| Name | Controls **must** have accessible names (visible label or `aria-label`) |
| Color | **Never** convey state by color alone; keep status roles semantic |
| Motion | **Must** respect `prefers-reduced-motion` |
| Appearance `clearline` / kit `utility-clear` | Prefer for dense admin / critical a11y contexts |

### 2.9 Research & references

| Doc | Use |
| --- | --- |
| [`design-research.md`](./design-research.md) | Living brief: sources → implications → kit/principle mapping |
| [`references.md`](./references.md) | Curated board: why / steal / don’t copy |
| Example UI | `theme-example/research.html` |

**Quality bar:** agents cite one research implication when changing tokens or a11y rules; fashion still goes to Trends, not silent core edits.

### 2.10 Imagery & atmosphere

| Token | Role |
| --- | --- |
| `--page-atmosphere` | Page background stack |
| `--hero-plane` / `--hero-glow` | Inverse/hero field (marketing only) |
| `--grain-opacity` | Optional grain; 0 in Clearline / print |
| `--img-overlay` | Scrim over photography |

**Must** prefer real product/place imagery when a visual anchor is required. **Never** place detached badges/stickers on hero media. Guidelines surfaces **should** stay calm (field + hairline) — cinematic heroes are optional marketing, not the default for documentation UI.

---

## 3. Composition patterns

### 3.1 First viewport (marketing)
**Must** include at most: brand (appropriate strength) · one headline · one short support line · one CTA group · one plane.  
**Never** put stats, schedules, address blocks, or promo grids in the first viewport.

### 3.2 First viewport (guidelines / app)
**Must** prioritize navigation + page title + primary content. Brand may be nav-scale. Deference to content over atmosphere.

### 3.3 Section discipline
One job · one title · usually one support sentence · then content.

### 3.4 Cards
**Default: no cards.** Allowed only as containers for **interaction** (selection, form group, editable entity). If removing border/shadow/radius does not hurt understanding, it is not a card.

### 3.5 CTA group
Primary + optional secondary. Max two in a hero. Primary uses signal fill.

---

## 4. Components

Specs. Implement with tokens. Anatomy → variants → states → sizes.

### 4.1 Button

| | |
| --- | --- |
| **Anatomy** | Label (required) · optional leading icon |
| **Variants** | `primary` (signal fill) · `secondary`/`ghost` (hairline) · `destructive` (danger fill, rare) |
| **States** | default · hover · active · focus-visible · disabled |
| **Size** | Min height **44px**; horizontal pad ≥ `--space-4`; radius `--radius-md` |
| **Type** | Label role (`--text-sm`, weight 500) |

**Must:** one primary per region. **Never:** primary styling on non-actions.

### 4.2 Text link

| | |
| --- | --- |
| **Variants** | In-content · nav · quiet meta |
| **States** | default · hover (underline) · focus-visible |
| **Color** | Signal on light; signal-bright on dark |

### 4.3 Text field / select

| | |
| --- | --- |
| **Anatomy** | Label · control · helper/error |
| **States** | default · hover · focus · disabled · error · read-only |
| **Size** | Min height 44px; pad `--space-3`–`4`; radius `--radius-md` |
| **Border** | Hairline; focus → `--elev-focus` |

**Must** associate `<label>` with control. Error text **must** use danger role + text, not color alone.

### 4.4 Checkbox / radio / switch

| | |
| --- | --- |
| **Hit target** | ≥ 44×44 including label |
| **Focus** | Visible on control |
| **Switch** | Only true binary settings — not navigation |

### 4.5 Navigation

| | |
| --- | --- |
| **Anatomy** | Brand mark · primary links · optional utilities (e.g. appearance switcher) |
| **Rules** | Nav **must not** outrank page title in product UI; on marketing, brand may be stronger in content than in nav |
| **Mobile** | Collapse secondary links; keep brand + key action |

### 4.6 List

| | |
| --- | --- |
| **Variants** | Plain (default) · interactive rows (selection) |
| **Rules** | Prefer open layout (type + space). Dividers via hairline, not cards |

### 4.7 Interactive card / tile

| | |
| --- | --- |
| **When** | Only if selectable or actionable as a unit |
| **States** | default · hover · pressed/selected · focus · disabled |
| **Selected** | Signal border + soft signal wash |

### 4.8 Dialog / modal

| | |
| --- | --- |
| **Anatomy** | Title · body · actions (secondary left/quiet, primary right/end) |
| **Behavior** | Focus trap · Esc closes when allowed · restore focus on dismiss |
| **Elevation** | z 40; scrim `--color-scrim` |
| **Size** | Max width ~ `--measure`; pad ≥ `--space-5` |

### 4.9 Toast / inline alert

| | |
| --- | --- |
| **Roles** | info (ink) · ok · warn · danger |
| **Rules** | Short; actionable if needed; **never** block the whole UI for non-critical info |

### 4.10 Badge / tag

| | |
| --- | --- |
| **Variants** | Meta (quiet) · signal outline · solid ink |
| **Use** | Status / taxonomy labels — not CTAs |
| **Type** | Uppercase xs · weight 600 · short labels |

### 4.11 Tabs

| | |
| --- | --- |
| **Anatomy** | Tab list · one visible panel |
| **States** | selected (signal underline) · default · focus-visible · disabled |
| **A11y** | `role="tablist"` / `tab` / `tabpanel`; arrow keys in production |

### 4.12 Table

| | |
| --- | --- |
| **Style** | Hairline rules · open density · no card wrapper required |
| **Header** | Weight 500 · field wash |
| **Overflow** | Horizontal scroll on narrow viewports |

### 4.13 Breadcrumb

| | |
| --- | --- |
| **Anatomy** | Ancestors as links · current as text (`aria-current="page"`) |
| **Separator** | Quiet slash / middot — decorative (`aria-hidden`) |
| **Rules** | Hierarchy without chrome noise; omit on top-level pages

### 4.14 Pagination

| | |
| --- | --- |
| **Anatomy** | Prev · page numbers · Next |
| **Current** | Solid ink fill; clear `aria-current="page"` |
| **Rules** | Compact; disable edges at bounds |

### 4.15 Menu / dropdown

| | |
| --- | --- |
| **Anatomy** | Trigger · menu · menuitems |
| **Behavior** | One open menu; Esc + outside click close in prod; restore focus |
| **Destructive** | Danger text at end of list; confirm in dialog when irreversible |

### 4.16 Disclosure / accordion

| | |
| --- | --- |
| **Anatomy** | Header button (`aria-expanded`) · body |
| **Rules** | Open layout; hairline between items — not stacked cards |
| **Default** | Prefer one open panel unless comparison needs many |

### 4.17 Progress / skeleton

| | |
| --- | --- |
| **Progress** | Quiet bar; `role="progressbar"` + valuemin/max/now |
| **Skeleton** | Field wash shimmer; honor `prefers-reduced-motion` |
| **Never** | Decorative spinner theater for routine loads |

### 4.18 Empty state

| | |
| --- | --- |
| **Anatomy** | One sentence · one primary action |
| **Rules** | No illustration required; dashed or calm field, not a promo card |

### 4.19 Avatar

| | |
| --- | --- |
| **Fallback** | Initials on soft signal wash |
| **Sizes** | sm (~28) · md (~40) · lg (~52) |
| **Rules** | Decorative images need empty alt; initials need accessible name |

### 4.20 Tooltip

| | |
| --- | --- |
| **Content** | Short · supplemental only |
| **Never** | Essential instructions only in tooltips |
| **Behavior** | Delay + dismiss on Esc in production; visible on focus too |

### 4.21 Divider

| | |
| --- | --- |
| **Variants** | Plain hairline · labeled (“or continue”) |
| **Rules** | Separate jobs on one surface; do not use as decoration spam |

### 4.22 Segmented control

| | |
| --- | --- |
| **Use** | Mutually exclusive compact filters (day / week / month) |
| **States** | pressed (chalk fill) · default · focus-visible |
| **A11y** | `role="group"` + `aria-pressed` per option |

---

## 5. Interaction patterns

| Pattern | Guidance |
| --- | --- |
| Forms | Label above control; group related fields; primary submit once |
| Validation | Inline on submit (or blur for critical); keep values; plain-language errors |
| Empty states | One sentence + one action; no illustration required |
| Loading | Prefer skeleton/quiet progress over decorative spinners |
| Navigation | Same destinations in same places; don’t surprise with new IA per appearance |
| Destructive | Confirm in dialog; danger button; clear consequence copy |

---

## 6. Content & voice

- Short, concrete, calm. Verbs and nouns over hype.
- One support sentence beats a paragraph in section ledes.
- **Never** emoji decoration in product chrome.
- Demo identity **Northline Studio** appears only in examples — not as the Project’s product name.

---

## 7. Platforms & adapters

Same roles; density and motion adapt.

| Surface | Guidance |
| --- | --- |
| **Website (marketing)** | Atmosphere allowed; hero budget (§3.1); motion optional |
| **Website (guidelines/docs)** | Calm field; philosophy → foundations → components; deference to text |
| **App UI** | Denser spacing (`--space-3`–`5`); quieter motion; signal for primary/focus |
| **HTML export** | Link/inline tokens; drop ambient motion if static |
| **PDF / print** | `print.css`: ink-safe; signal → deep; no grain/motion; hide switchers |

| Adapter | Path |
| --- | --- |
| CSS variables | Kit `tokens.css` · app `src/styles/tokens.css` · legacy `theme-example/tokens.css` |
| Appearances | Kit `theme.css` · legacy `theme-example/themes.css` |
| Tailwind | Kit / `theme-example/tailwind.theme.snippet.js` → `signalFieldThemes[id]` |
| Print | Kit `print.css` · legacy `theme-example/print.css` |

**Invariant:** brand weight appropriate to surface · signal = accent role · type pairing · section discipline.

Prefer **native** platform patterns (system dialogs, list selection) for OS apps when building native shells; use Signal Field tokens for brand chrome and web surfaces.

---

## 8. Appearance modes

Appearances are **tonal palettes** under one philosophy — not separate brands or mood boards. Same composition, components, and roles.

Activate: `?theme=<id>` or `html[data-theme]`.

| ID | Name | Brand kit | When to use | Value deltas (summary) |
| --- | --- | --- | --- | --- |
| `signal` | Signal (default) | `precise-quiet` | General product + dark marketing | Graphite deep; teal signal |
| `dayfield` | Dayfield | `day-editorial` | Light editorial / daytime | Cool mist; ink on light |
| `kiln` | Kiln | `warm-commerce` | Commerce warmth | Stone field; copper signal |
| `clearline` | Clearline | `utility-clear` | A11y / admin / utility | Near B/W; strong focus; tight radius |
| `soft-product` | Soft product | `soft-product` | Gentle consumer product | Sage; soft radii; Jakarta |
| `ink-ledger` | Ink ledger | `ink-ledger` | Fintech / ops order | Slate blue; denser; Space Grotesk |

**Must** document new appearances here and ship a matching `docs/brand-kits/<id>/` package. **Never** treat an appearance or kit as a competing system.

---

## 9. Trends (append-only, secondary)

Fashion is subordinate to §1–§8. Agents adopt a Trend only when asked.

**Canonical split**
| Layer | Path | Role |
| --- | --- | --- |
| Technical log (this §) | `design.md` §9 | **Canonical for agents enforcing rules** — append-only history |
| Friendly structured data | `brand-options/trends.json` | **Canonical for UI / browse / recommend tags** |
| Human index | `trends/README.md` | Short category cards |
| UI | Next `/trends` (AI add) · legacy `theme-example/trends.html` | Category cards (KO+EN) |

When adding a trend: update `trends.json` **and** prepend a dated entry here.

### Template (prepend newest)

```md
### YYYY-MM-DD — Short name
- **Intent:** …
- **Allowed surfaces:** …
- **Token deltas:** …
- **Composition deltas:** …
- **Do not:** …
- **Example:** …
```

### Log

#### 2026-10-13 — Research-backed a11y floor (WCAG 2.2)
- **Intent:** Encode Focus Appearance / Target Size / Focus Not Obscured implications into §2.8; add living research + reference board.
- **Allowed surfaces:** all
- **Token deltas:** none required (Clearline already 4px focus); document 24px floor + 44px preference
- **Composition deltas:** none
- **Do not:** paste W3C/Apple/Google guideline prose into kits
- **Example:** `docs/design-research.md`, `docs/references.md`, Next `/research`

#### 2026-10-13 — Guidelines-site framing
- **Intent:** Present Signal Field as an institutional guide (philosophy → foundations → components), not a cinematic demo.
- **Allowed surfaces:** docs / guidelines web
- **Token deltas:** none required; guidelines UI prefers calm field over hero glow
- **Composition deltas:** docs first viewport = nav + title + principles (not marketing hero budget)
- **Do not:** replace principles with landing-page marketing prose
- **Example:** Next app `/` · `/foundations` · `/doc`

#### 2026-10-13 — Appearance modes gallery
- **Intent:** Formalize signal / dayfield / kiln / clearline as appearances.
- **Allowed surfaces:** web / export / print (print flattens atmosphere)
- **Token deltas:** atmosphere vars; `themes.css` overrides
- **Composition deltas:** none
- **Do not:** four competing brands
- **Example:** kit `theme.css` · legacy `theme-example/?theme=dayfield`

#### 2026-09-18 — Quiet commerce materiality
- **Intent:** Warm product surfaces via Kiln appearance.
- **Allowed surfaces:** web / app commerce
- **Token deltas:** Kiln copper signal
- **Do not:** cream + terracotta + serif kit
- **Example:** `?theme=kiln`

#### 2026-08-02 — Utility high-contrast
- **Intent:** Clearline appearance for a11y/utility.
- **Allowed surfaces:** app / admin / print
- **Token deltas:** Clearline focus/radius/type
- **Do not:** remove focus rings
- **Example:** `?theme=clearline`

#### 2026-06-21 — Soft grain atmosphere
- **Intent:** Subtle grain + gradient planes instead of flat or glass stacks.
- **Allowed surfaces:** marketing web; omit print/clearline
- **Token deltas:** `--grain-opacity`, atmosphere stacks
- **Do not:** noise that harms type

#### 2026-04-10 — Kinetic brand lockups
- **Intent:** Short entrance motion on marketing heroes only.
- **Allowed surfaces:** marketing web
- **Do not:** animate every section

#### 2026-02-08 — Chromatic restraint
- **Intent:** Single accent family year.
- **Allowed surfaces:** all
- **Do not:** secondary brand purple

#### 2026-10-13 — Initial Signal Field lock
- **Intent:** Core graphite + signal teal system.
- **Allowed surfaces:** all
- **Do not:** purple / cream-terracotta / broadsheet defaults

---

## 10. Agent checklist

- [ ] Principles P1–P10 considered; meta clarity/deference/depth hold
- [ ] If service brief given: recommend-map scored → primary + 2 alts with rationale
- [ ] If existing product: same apply path — `design.md` + kit wired; no parallel system
- [ ] Mix composed (or preset / recommend); option ids cited in exported `DESIGN.md`
- [ ] Portable files exported / `_generated/<slug>/` path recorded
- [ ] Color **roles** used correctly (signal ≠ body text ≠ status)
- [ ] Type roles match chosen type option (default IBM Plex Sans (`plex`) when applicable)
- [ ] 8pt spacing; hit targets ≥ 44px where practical
- [ ] Components match §4 states (esp. focus)
- [ ] Composition: marketing hero budget **or** guidelines/app deference — correctly chosen
- [ ] Cards only for interaction
- [ ] a11y: contrast, focus, names, reduced motion
- [ ] Platform adapter correct (§7)
- [ ] No anti-pattern clusters (§1.3)
- [ ] Trends only if requested — core untouched; friendly cards synced with `trends.json`
