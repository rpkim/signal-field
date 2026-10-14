# Signal Field

Quiet product design system — Next.js App Router guidelines + brand tools.

**Repo:** https://github.com/rpkim/signal-field (private)

## How to use (start here)

**One-line answer:** give implementing agents **`design.md` + exported `tokens.css` + `theme.css`**.  
Compose **Download kit (zip)** packs those three in one click (plus kit `DESIGN.md` / `mix.json`).

Full playbook (KO section headers + EN): **[USAGE.md](./USAGE.md)** · also store `docs/USAGE.md`.

Canonical guidelines: **`content/design.md`** (rendered at `/doc`).

### Copy-paste agent prompt

```
You must follow Signal Field design.md (attached / SIGNAL-FIELD-design.md in the kit zip).
Use this kit: [attach zip or tokens.css + theme.css + DESIGN.md].
Import order: tokens.css, then theme.css.
Service: …
Do / Don’t: quiet chrome, one accent, kit type pairing, responsive --bp-sm/md/lg.
Implement UI using design.md §1–§4 — do not invent a parallel system.
```

### Paths

| Goal | Steps |
| --- | --- |
| New UI | Brief → `/recommend` → `/compose` → Download zip → wire CSS in target repo |
| Rebrand | `/rebrand` → hook CSS → optional full kit zip |
| Reload mix | Compose Save → `/doc` Load → re-export zip |

### CSS import order

```html
<link rel="stylesheet" href="./tokens.css" />
<link rel="stylesheet" href="./theme.css" />
```

## Dev

```bash
git clone https://github.com/rpkim/signal-field.git
cd signal-field
cp .env.example .env.local   # optional OPENAI_API_KEY / ANTHROPIC_API_KEY
npm install
npm run dev -- -H 127.0.0.1 -p 3000
```

Open http://127.0.0.1:3000

| Env | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | AI propose on `/trends` `/research` |
| `ANTHROPIC_API_KEY` | Fallback if OpenAI unset |

Without keys, Discover still runs **offline** (topic + URLs/notes → schema).

## Routes

`/` · `/foundations` · `/components` · `/compose` · `/recommend` · `/rebrand` · `/trends` · `/research` · `/kits/precise-quiet` · `/doc`

## Persistence

| Path | Contents |
| --- | --- |
| `content/design.md` | Canonical guidelines (sync from store `docs/design.md`) |
| `content/additions/*.json` | Accepted AI/offline Trends/Research |
| `content/saved-mixes.json` | Compose Save → Doc Load |
