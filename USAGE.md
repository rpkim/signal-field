# Signal Field — How to use / 사용법

Canonical system: **`design.md`**. Product shell: [rpkim/signal-field](https://github.com/rpkim/signal-field) (Next.js).

**Two layers**
1. **Baseline:** always follow **`design.md`** (rules, checklist, responsive).
2. **Theme kit (optional but usual):** Compose export — `tokens.css` + `theme.css` (+ kit `DESIGN.md`).

**Answer in one line:** give an implementing agent **`design.md` + the exported kit CSS**. Prefer Compose **Download kit (zip)**.

---

## What to give an agent (5 bullets)

1. **System rules:** `design.md` (repo `content/design.md` / zip `SIGNAL-FIELD-design.md`).
2. **Kit CSS:** `tokens.css` then `theme.css` from Compose zip.
3. **Service brief:** what / who / tone (KO or EN).
4. **Do / Don’t:** §1 anti-patterns (no purple SaaS, no Syne/Figtree defaults, cards only when interactive).
5. **Checklist:** implement against `design.md` §1–§4 (+ §2.4 Responsive).

### Copy-paste prompt

```
You must follow Signal Field design.md (attached / SIGNAL-FIELD-design.md in the kit zip).
Use this kit: [attach zip or tokens.css + theme.css + DESIGN.md].
Import order: tokens.css, then theme.css.
Service: [무엇 / 누구 / 톤]
Do: quiet chrome, one accent, kit type, responsive at --bp-sm/md/lg.
Don’t: purple gradients, card farms, novelty display fonts, desktop-only layout.
Implement UI using design.md §1–§4 checklist — do not invent a parallel design system.
```

---

## Path 1 — New or existing product UI

1. Brief → **`/recommend`** (optional) → **`/compose`**.
2. Pick from the expanded theme space (color · type · density · presets).
3. Optionally open **`/trends`** or **`/research`** → **AI로 찾아서 추가** (one button; auto-adds to catalogs).
4. Back in Compose → **업데이트 반영** if new items appeared → **Download kit (zip)**.
5. Hand the zip (or `design.md` + CSS) to the implementing agent.

Existing product: same path — applying the kit **is** the rebrand (no Rebrand menu).

---

## Path 2 — AI Discover (Trends / Research)

| Page | Main UX |
| --- | --- |
| `/trends` | One primary button: **AI로 찾아서 추가** (+ optional topic) |
| `/research` | Same — button-first, not a browsable card catalog |

On click: propose → **auto-accept** high-confidence candidates into `content/additions/{trends,research}.json` → toast + history of what was added. Compose reloads catalogs on focus and **업데이트 반영** folds them into the mix.

Offline (no API keys): still structures topic/notes into the same schema and auto-adds.

---

## Path 3 — Saved mixes

1. Compose: name → **Save** → `content/saved-mixes.json`.
2. `/doc` → **Load in Compose**.
3. Re-export zip anytime.

---

## Zip contents

| File | Required | Role |
| --- | --- | --- |
| `design.md` / `SIGNAL-FIELD-design.md` | yes | Full guidelines (baseline) |
| `tokens.css` | yes | Theme variables |
| `theme.css` | yes | Base application layer |
| `DESIGN.md` / `mix.json` / `README.md` | extra | Mix citation |

---

## Product routes

| Route | Use |
| --- | --- |
| `/doc` | Full `design.md` + saved mixes |
| `/recommend` | Brief → ranked themes |
| `/compose` | Rich mixer + Save + 업데이트 반영 + **Download kit (zip)** |
| `/trends` `/research` | Button-only AI discover & auto-add |

Dev: `npm run dev -- -H 127.0.0.1 -p 3000` · Optional AI: see `.env.example`.
