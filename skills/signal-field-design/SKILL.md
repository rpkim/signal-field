---
name: signal-field-design
description: >
  Apply Signal Field design system to any UI task: always attach design.md as the
  best-practice baseline; optionally compose/export a theme kit (tokens.css +
  theme.css). Use when building or restyling websites, apps, HTML/PDF exports,
  recommending a theme from a service brief, or judging UI craft. Triggers:
  design.md, design system, branding kit, Compose, theme mix, Signal Field,
  UI guidelines, rebrand with kit, Rams/HIG-level craft.
---

# Signal Field design

Staff/Principal-level product design system for agents. **Not** a demo landing template.

## Sources of truth

| Artifact | Role |
| --- | --- |
| Repo [`content/design.md`](../../content/design.md) | Canonical guidelines (must / should / never) |
| Repo [`USAGE.md`](../../USAGE.md) | Human + agent handoff playbook |
| Repo [rpkim/signal-field](https://github.com/rpkim/signal-field) | Next.js App Router product (`~/signal-field` on Mac) |
| Compose zip export | Portable theme overlay |

Prefer the Next app routes (`/compose`, `/recommend`, `/trends`, `/research`, `/doc`) over legacy `docs/theme-example/`.

## Two-layer model (always)

1. **Baseline (theme-independent)** — Give the implementing agent **`design.md` in full**. This is the default prompt layer for any app: philosophy, foundations (incl. responsive), components, a11y, anti-patterns.
2. **Optional theme** — If a specific look is wanted, add the Compose kit: at least **`tokens.css` + `theme.css`** (zip also includes kit `DESIGN.md`, `mix.json`, `README`). Import `tokens.css` then `theme.css`.

Never ship CSS alone without `design.md`. Never invent a parallel system.

### Copy-paste agent prompt

```
You must follow Signal Field design.md (attached).
Optional theme kit attached: tokens.css + theme.css (and kit DESIGN.md if present).
Service brief: [What / Who / Tone]
Implement against design.md §1–§4 and §2.4 Responsive.
Do not invent a second palette, novelty display fonts, or card farms.
```

## When the user describes a new service

1. Score the brief (What / Who / Tone) with recommend logic / `/recommend`.
2. Return **1 primary mix + 2 alternatives** with rationale (color, type, density, research lean).
3. Compose or load preset → **Download kit (zip)** once (design.md + tokens + theme together).
4. Hand zip + brief to the implementing agent.

## Quality bar

- Peer designer critique (user has design education). Reject generic AI/SaaS templates.
- Clarity · deference · depth. Rams-like restraint; Material/HIG *shape* without copying vendor prose.
- **Default type:** IBM Plex Sans (`plex`) + IBM Plex Mono for code. Never default Syne / Figtree / Inter as the expressive system face.
- **One accent family** (`--color-signal`). No purple→indigo-on-white; no cream+terracotta+serif cliché; no broadsheet parody; no glow/glass card farms as identity.
- Cards only for interaction. Hero budget / section discipline per `design.md` §3.
- **Responsive is required** (breakpoints, nav collapse, Compose stacks, ≥44px targets) — document and ship it; the shell must itself be responsive.
- Research lean (e.g. Liquid Glass) must **visibly** affect specimen tokens when selected in Compose.

## Product UI conventions (signal-field app)

- KO/EN locale switcher; EN must not show Korean glosses.
- Trends / Research: catalog readable + copyable concept prompts; AI add managed via `/admin` (local SQLite), not as the public primary browse chore.
- Compose: save mixes; sync when catalogs update; live specimen reflects color/type/density **and** research deltas.
- Applying `design.md` + kit **is** the rebrand path (no separate Rebrand menu required).

## Agent checklist (ship gate)

- [ ] `design.md` attached / followed
- [ ] Theme kit attached only if a look was chosen (zip three-core minimum)
- [ ] Service brief scored if provided
- [ ] Color roles correct (signal ≠ body ≠ status)
- [ ] Type = recommended default unless user picked another pairing
- [ ] 8pt space; responsive §2.4; focus-visible; reduced motion
- [ ] Components have real states; no parallel design system
- [ ] No anti-pattern clusters from `design.md` §1.3

## Do not

- Treat Signal Field as a static HTML sample or mood-board site
- Expand features while craft is below peer bar
- Silently rewrite core principles for fashion (Trends are secondary / append-only)
- Commit or echo admin passwords in docs
