# Signal Field — How to use / 사용법

Canonical system: **`design.md`**. Product shell: [rpkim/signal-field](https://github.com/rpkim/signal-field) (Next.js).

**Answer in one line:** give an implementing agent **`design.md` (system rules) + the exported kit CSS (`tokens.css` + `theme.css`)**. Not random CSS alone. Prefer the Compose **Download kit (zip)** — one click packs all three.

---

## What to give an agent (5 bullets)

1. **System rules:** attach or link `design.md` (repo `content/design.md` / store `docs/design.md`, also named `SIGNAL-FIELD-design.md` inside the zip).
2. **Kit CSS:** `tokens.css` then `theme.css` (import order below) from Compose zip or `docs/brand-kits/<id>/`.
3. **Service brief:** what / who / tone (KO or EN).
4. **Do / Don’t:** cite §1 anti-patterns (no purple SaaS, no Syne/Figtree defaults, cards only when interactive).
5. **Checklist:** implement against `design.md` §1–§4 (and §2.4 Responsive) — do not invent a parallel system.

### Copy-paste prompt

```
You must follow Signal Field design.md (attached / SIGNAL-FIELD-design.md in the kit zip).
Use this kit: [attach zip or tokens.css + theme.css + DESIGN.md].
Import order: tokens.css, then theme.css.
Service: [무엇 / 누구 / 톤]
Do: quiet chrome, one accent, IBM Plex (or kit type), responsive at --bp-sm/md/lg.
Don’t: purple gradients, card farms, novelty display fonts, desktop-only layout.
Implement UI using design.md §1–§4 checklist — do not invent a parallel design system.
```

---

## Path 1 — New product UI (agent in another repo)

1. Give the agent: `design.md` (or GitHub `rpkim/signal-field` + path `content/design.md`).
2. Give a service brief (무엇/누구/톤).
3. Rank a mix: open **`/recommend`**, or have the agent follow `recommend-map.md` + `brand-options/*`.
4. Open **`/compose`** (deep-link from Recommend) → adjust → **Download kit (zip)**.
5. Unzip into the target repo. Wire CSS:

```html
<link rel="stylesheet" href="./signal-field/tokens.css" />
<link rel="stylesheet" href="./signal-field/theme.css" />
```

(`theme.css` already `@import`s `tokens.css` — linking only `theme.css` is fine if the path resolves.)

6. Agent implements UI following `design.md` §1–§4 (+ Responsive §2.4). Use kit `DESIGN.md` for the mix citation.

**Disk kits:** `docs/brand-kits/<preset-id>/` (e.g. `precise-quiet`) already contain the same shape.

---

## Path 2 — Existing product (apply kit = rebrand)

No separate Rebrand tool in the product menu. Applying Signal Field **is** the rebrand:

1. Same as Path 1: brief → **`/recommend`** → **`/compose`** → **Download kit (zip)**.
2. Give the agent **`design.md` + `tokens.css` + `theme.css`** (and the service brief).
3. Agent restyles the existing UI against `design.md` §1–§4 using the kit — do not invent a parallel system.

---

## Path 3 — Saved mixes

1. In Compose: name mix → **Save** → stored in `content/saved-mixes.json`.
2. Open **`/doc`** → **Load in Compose** (`/compose?save=<id>`).
3. **Download kit (zip)** again — same three core files for handoff.

---

## Zip contents (one button)

| File | Required | Role |
| --- | --- | --- |
| `design.md` / `SIGNAL-FIELD-design.md` | yes | Full Signal Field guidelines |
| `tokens.css` | yes | Mix CSS variables |
| `theme.css` | yes | Base application layer |
| `DESIGN.md` | extra | Mix citation for this export |
| `mix.json` | extra | Machine-readable mix |
| `README.md` | extra | Wire-up notes |

---

## Product routes

| Route | Use |
| --- | --- |
| `/doc` | Full `design.md` + saved mixes |
| `/recommend` | Brief → ranked themes |
| `/compose` | Mix + Save + Sync + **Download kit (zip)** |
| `/trends` `/research` | Canon + AI search & add |

Dev: `npm run dev -- -H 127.0.0.1 -p 3000` · Optional AI: see `.env.example`.
