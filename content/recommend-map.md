# Service → theme recommend map

Agents: given a **service / product brief**, read this map + `brand-options/*.json`, return **1 primary mix + 2 alternatives** with rationale, then point to Compose export.

UI: `theme-example/recommend.html` (same heuristics in `recommend.js`).

**New or existing:** both stay on this map → Compose → kit export. Applying `design.md` + kit CSS to an existing UI **is** the rebrand (no separate Rebrand menu in the product app).

## Domains → primary mix

| Domain keywords (EN/KO examples) | Primary preset / mix | Color | Type | Density | Trends lean | Why |
| --- | --- | --- | --- | --- | --- | --- |
| fintech, bank, ledger, trading, 결제, 금융, 장부 | `ink-ledger` | ledger-slate | grotesk-source | compact | chromatic-restraint, utility-contrast | Order, dense data, slate trust |
| commerce, shop, store, checkout, 커머스, 쇼핑, 스토어 | `warm-commerce` | kiln-copper | outfit-figtree | comfortable | quiet-commerce | Product warmth without cliché kits |
| admin, saas, dashboard, b2b, 관리자, 대시보드 | `precise-quiet` | signal-teal | plex | default | compose-export, deference-chrome | Precise default Signal Field |
| education, learning, course, 교육, 학습 | `day-editorial` | day-mist | plex | comfortable | fluid-rem-type, guidelines-framing | Daylight reading calm |
| consumer, lifestyle, onboarding, 소비자, 라이프 | `soft-product` | soft-sage | jakarta | comfortable | soft-grain (mkt), deference-chrome | Soft geometry, gentle product |
| health, wellness, medical, 건강, 의료 | — custom | arctic-ice *or* soft-sage | plex / jakarta | comfortable | utility-contrast if clinical | Calm cyan-steel or soft sage |
| climate, outdoor, green, 환경, 아웃도어 | — custom | forest-canopy | plex | default | chromatic-restraint | Grounded moss, not neon eco |
| travel, marine, ocean, 여행, 해양 | — custom | ocean-depth | plex | comfortable | soft-grain (mkt) | Deep maritime cool |
| portfolio, photo, studio, 포트폴리오 | — custom | mono-graphite | plex | comfortable | kinetic-lockups (mkt) | Type-led mono |
| architecture, material, 건축 | — custom | sand-stone | outfit-figtree | default | quiet-commerce lean | Mineral neutral |
| energy, launch, startup hype, 에너지 | — custom | ember-volt | outfit-figtree | default | kinetic-lockups | Restrained electric amber |
| beauty, wellness soft, 뷰티 | — custom | rose-mineral | jakarta | comfortable | soft-grain | Cool dusty rose, not terracotta |
| night demo, immersive, 다크 | — custom | ink-carbon | plex | default | soft-grain | Dark-first plane |
| a11y, accessibility, government, 접근성, 공공 | `utility-clear` | clear-ink | plex | a11y-large | utility-contrast | Max clarity |

## Agent output pattern
```
Primary: {preset?} color=X type=Y density=Z research=[…] references=[…]
Why: …
Trends: …
Alts: (2) …
Apply: theme-example/compose.html?color=X&type=Y&density=Z  (or preset=id)
Export: download from Compose → or brand-kits/_generated/<slug>/
```

## Scoring (UI)
+3 domain keyword hit on primary row · +1 research/a11y tokens in brief · +1 commerce/fintech specific · prefer preset when exact match.
