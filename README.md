# Signal Field

Quiet product design system — Next.js App Router guidelines + brand tools.

**Repo:** https://github.com/rpkim/signal-field

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
| New UI | Brief → `/compose` → Download zip → wire CSS in the target repo |
| Existing product | `/rebrand`, then the same kit export |
| Trends and research | Read `/trends` or `/research`. Add items at `/admin` (not in the nav): Find lists drafts, Add saves them |
| Reload mix | Compose Save → `/doc` Load → re-export zip |

### CSS import order

```html
<link rel="stylesheet" href="./tokens.css" />
<link rel="stylesheet" href="./theme.css" />
```

## Local path

```
~/signal-field
```

## Dev

```bash
git clone https://github.com/rpkim/signal-field.git
cd signal-field
cp .env.example .env.local   # GEMINI_API_KEY and ADMIN_PASSWORD; never commit this file
npm install
npm run dev -- -H 127.0.0.1 -p 3000
```

Open http://127.0.0.1:3000

| Env | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Admin Find. Without it, drafts stay offline |
| `GEMINI_MODEL` | Optional. Default `gemini-2.5-flash` |
| `ADMIN_PASSWORD` | Required to open `/admin`. Set it only in `.env.local` |
| `OPENAI_API_KEY` | Optional fallback if Gemini is unset |
| `ANTHROPIC_API_KEY` | Optional fallback if OpenAI is unset |

Find never writes by itself. An item, including its resource links, is saved when you choose Add. Restart the dev server after changing `.env.local`.

## Theme options

Compose catalogs: **30** colors · **25** type pairings (default/recommended: `plex`) · **8** densities · **14** presets.

## Routes

`/` · `/foundations` · `/components` · `/compose` · `/rebrand` · `/trends` · `/research` · `/kits/precise-quiet` · `/doc` · `/admin` (unlisted)

## Persistence

| Path | Contents |
| --- | --- |
| `content/design.md` | Canonical guidelines (rendered at `/doc`) |
| `data/signal-field.sqlite` | Local trends and research catalog. Gitignored |
| `content/saved-mixes.json` | Compose Save → Doc Load |
