export type Locale = "ko" | "en";

export const LOCALE_COOKIE = "sf-locale";
export const LOCALE_STORAGE = "sf-locale";

export type MessageKey = keyof typeof en;

const en = {
  "brand.guidelines": "Guidelines",
  "nav.home": "Home",
  "nav.foundations": "Foundations",
  "nav.components": "Components",
  "nav.compose": "Compose",
  "nav.recommend": "Recommend",
  "nav.trends": "Trends",
  "nav.research": "Research",
  "nav.doc": "Doc",
  "nav.menu": "Menu",
  "nav.close": "Close",
  "nav.primary": "Primary",
  "locale.label": "Language",
  "locale.ko": "KO",
  "locale.en": "EN",
  "footer.note": "Signal Field · quiet product design system",
  "home.lede":
    "A quiet product design system. Clarity, deference, and depth — one accent, real space, type that earns its size.",
  "home.meta": "Meta",
  "home.clarity": "Clarity",
  "home.clarity.body":
    "Content and action legible at a glance. Never: low-contrast icons as sole affordance.",
  "home.deference": "Deference",
  "home.deference.body":
    "Chrome yields to content. Never: chrome that outranks the work.",
  "home.depth": "Depth",
  "home.depth.body":
    "Hierarchy via space and type. Never: glow stacks and badge clutter.",
  "home.sections": "Sections",
  "home.kicker.guide": "Guide",
  "home.kicker.tools": "Tools",
  "home.kicker.canon": "Canon",
  "home.kicker.kit": "Kit",
  "home.foundations.desc":
    "Color roles, type, space, responsive layout, motion, accessibility.",
  "home.components.desc": "Buttons, fields, focus — states before decoration.",
  "home.compose.desc":
    "Richer theme space (color · type · density) + kit zip export.",
  "home.recommend.desc": "Describe a service; get a ranked theme mix.",
  "home.trends.desc":
    "Read-only trend catalog — copy prompts; manage AI adds in Admin.",
  "home.research.desc":
    "Read-only research pillars — copy prompts; manage AI adds in Admin.",
  "home.kit.desc": "Default brand kit specimen — IBM Plex, signal teal.",
  "page.tools": "Tools",
  "page.guide": "Guide",
  "page.discover": "Discover",
  "page.canon": "Canon",
  "compose.title": "Compose",
  "compose.lede":
    "Mix research × references × color × type × density. Live specimen on the right; download a portable kit when the mix holds.",
  "compose.saveMix": "Save mix",
  "compose.saveName": "Name this mix",
  "compose.save": "Save",
  "compose.download": "Download kit (zip)",
  "compose.syncBanner":
    "Trends/Research catalogs have {n} item(s) not in this mix. Sync proposes adds/replaces — nothing changes until you confirm.",
  "compose.syncApply": "Apply updates",
  "compose.syncConfirm": "Confirm",
  "compose.syncDismiss": "Dismiss",
  "compose.loading": "Loading mixer…",
  "compose.presets": "Presets",
  "compose.typeHint": "Select one · default {id} (recommended)",
  "compose.recommended": "Recommended",
  "compose.selectOne": "Select one",
  "compose.selectUpTo": "Select up to {n}",
  "compose.trendsHint": "Select up to 3 (optional context)",
  "compose.hangulNote": "Hangul",
  "recommend.title": "Recommend",
  "recommend.lede":
    "Describe a service or product. Get a primary mix plus two alternatives — then open in Compose.",
  "recommend.brief": "Service brief",
  "recommend.briefHint":
    "Product type, audience, density, tone (new or existing).",
  "recommend.rank": "Rank themes",
  "recommend.openCompose": "Open in Compose →",
  "recommend.rebrandNote":
    "Existing product brief — applying Signal Field (design.md + Compose kit) is the rebrand. Open the primary mix in Compose and Download kit.",
  "discover.aiTitle": "Find with AI & add",
  "discover.aiIntro":
    "Find more related {kind} with AI and add them to the catalog. Then load into the mixer via Compose → Apply updates.",
  "discover.topic": "Topic",
  "discover.optional": "(optional)",
  "discover.button": "Find with AI & add",
  "discover.busy": "Searching…",
  "discover.history": "Added history",
  "discover.none": "No new items",
  "discover.kind.trends": "trends",
  "discover.kind.research": "research",
  "discover.toast.searching": "Searching {kind}…",
  "discover.toast.none": "No new items found",
  "discover.toast.skipped": "No new items (already present or skipped {n})",
  "discover.toast.added":
    "Added {n} · apply in Compose with 「Apply updates」",
  "trends.title": "Trends",
  "trends.lede":
    "Read-only catalog of trends used in Compose. Copy a concept prompt for agents — AI adds live under /admin.",
  "research.title": "Research",
  "research.lede":
    "Read-only catalog of research pillars used in Compose. Copy a concept prompt for agents — AI adds live under /admin.",
  "catalog.researchHeading": "Research pillars",
  "catalog.trendsHeading": "Trend catalog",
  "catalog.researchIntro":
    "Read-only. Copy the prompt for a pillar to paste into an agent brief.",
  "catalog.trendsIntro":
    "Read-only. Copy the prompt for a trend to paste into an agent brief.",
  "catalog.applySuffix": ".",
  "catalog.new": "New",
  "catalog.source": "Source",
  "catalog.when": "When",
  "catalog.skip": "Skip",
  "catalog.useInCompose": "Use in Compose →",
  "catalog.copyPrompt": "Copy prompt",
  "catalog.copied": "Copied",
  "doc.title": "design.md",
  "doc.eyebrow": "Canon",
  "doc.introEn":
    "Full Signal Field guidelines — the underlying system document. Compose Download kit (zip) bundles this file with tokens.css + theme.css.",
  "doc.introKo":
    "아래 본문(design.md)은 영문 가이드라인입니다. UI 크롬은 KO/EN으로 전환할 수 있습니다. 사용법은 USAGE.md · Compose에서 키트 zip을 내려받으세요.",
  "doc.canonical": "Canonical guidelines",
  "doc.canonicalDesc":
    "Full design.md below — philosophy, foundations, components, responsive, trends.",
  "doc.export": "Compose → zip kit",
  "doc.exportDesc": "One download: design.md + tokens.css + theme.css.",
  "doc.document": "Document",
  "doc.exportKicker": "Export",
  "foundations.title": "Foundations",
  "foundations.lede":
    "Color roles, type, space, responsive layout, motion, and accessibility norms.",
  "components.title": "Components",
  "components.lede":
    "Buttons, fields, and focus — states before decoration.",
  "saved.title": "Saved mixes",
  "saved.empty": "No saved mixes yet — Save from Compose.",
  "saved.load": "Load in Compose",
  "notfound.eyebrow": "404",
  "notfound.title": "Page not found",
  "notfound.lede":
    "This path isn’t in Signal Field. Head home, open Compose, or read the guidelines.",
  "notfound.home": "Back home",
  "notfound.compose": "Open Compose",
  "notfound.doc": "Read design.md",
} as const;

const ko: Record<MessageKey, string> = {
  "brand.guidelines": "가이드라인",
  "nav.home": "홈",
  "nav.foundations": "파운데이션",
  "nav.components": "컴포넌트",
  "nav.compose": "구성",
  "nav.recommend": "추천",
  "nav.trends": "트렌드",
  "nav.research": "리서치",
  "nav.doc": "문서",
  "nav.menu": "메뉴",
  "nav.close": "닫기",
  "nav.primary": "주요 메뉴",
  "locale.label": "언어",
  "locale.ko": "KO",
  "locale.en": "EN",
  "footer.note": "Signal Field · 고요한 제품 디자인 시스템",
  "home.lede":
    "고요한 제품 디자인 시스템. 명료함, 겸손한 크롬, 깊이 — 액센트 하나, 실제 여백, 크기를 벌어내는 타이포.",
  "home.meta": "메타",
  "home.clarity": "명료함",
  "home.clarity.body":
    "콘텐츠와 행동이 한눈에. 금지: 저대비 아이콘만으로 조작을 암시.",
  "home.deference": "겸손",
  "home.deference.body":
    "크롬이 콘텐츠에 양보. 금지: 작업보다 앞서는 크롬.",
  "home.depth": "깊이",
  "home.depth.body":
    "여백과 타이포로 위계. 금지: 글로우 스택·배지 난립.",
  "home.sections": "섹션",
  "home.kicker.guide": "가이드",
  "home.kicker.tools": "도구",
  "home.kicker.canon": "캐논",
  "home.kicker.kit": "키트",
  "home.foundations.desc":
    "컬러 역할, 타이포, 여백, 반응형, 모션, 접근성.",
  "home.components.desc": "버튼·필드·포커스 — 장식보다 상태.",
  "home.compose.desc":
    "풍부한 테마 공간(컬러·타입·밀도) + 키트 zip 내보내기.",
  "home.recommend.desc": "서비스를 설명하면 순위가 매겨진 테마 믹스.",
  "home.trends.desc":
    "읽기 전용 트렌드 카탈로그 — 프롬프트 복사; AI 추가는 Admin.",
  "home.research.desc":
    "읽기 전용 리서치 필러 — 프롬프트 복사; AI 추가는 Admin.",
  "home.kit.desc": "기본 브랜드 키트 표본 — IBM Plex, 시그널 틸.",
  "page.tools": "도구",
  "page.guide": "가이드",
  "page.discover": "디스커버",
  "page.canon": "캐논",
  "compose.title": "구성",
  "compose.lede":
    "리서치 × 레퍼런스 × 컬러 × 타입 × 밀도를 섞으세요. 오른쪽 라이브 표본 · 확정 후 키트 zip.",
  "compose.saveMix": "믹스 저장",
  "compose.saveName": "믹스 이름",
  "compose.save": "저장",
  "compose.download": "키트 다운로드 (zip)",
  "compose.syncBanner":
    "트렌드/리서치 카탈로그에 이 믹스에 없는 항목이 {n}개 있습니다. 반영은 확인 후에만 적용됩니다.",
  "compose.syncApply": "업데이트 반영",
  "compose.syncConfirm": "확인",
  "compose.syncDismiss": "닫기",
  "compose.loading": "믹서 불러오는 중…",
  "compose.presets": "프리셋",
  "compose.typeHint": "하나 선택 · 기본 {id} (추천)",
  "compose.recommended": "추천",
  "compose.selectOne": "하나 선택",
  "compose.selectUpTo": "최대 {n}개",
  "compose.trendsHint": "최대 3개 (선택 맥락)",
  "compose.hangulNote": "한글",
  "recommend.title": "추천",
  "recommend.lede":
    "서비스·제품을 설명하세요. 1순위 + 대안 2개 — Compose에서 열기.",
  "recommend.brief": "서비스 브리프",
  "recommend.briefHint":
    "제품 유형, 대상, 밀도, 톤 (신규 또는 기존).",
  "recommend.rank": "테마 순위",
  "recommend.openCompose": "Compose에서 열기 →",
  "recommend.rebrandNote":
    "기존 제품 브리프 — Signal Field(design.md + Compose 키트) 적용이 곧 리브랜드입니다. 1순위 믹스를 Compose에서 열고 키트를 받으세요.",
  "discover.aiTitle": "AI로 찾아서 추가",
  "discover.aiIntro":
    "AI로 관련 {kind}를 더 찾아 카탈로그에 추가합니다. Compose → 업데이트 반영으로 믹서에 불러오세요.",
  "discover.topic": "토픽",
  "discover.optional": "(선택)",
  "discover.button": "AI로 찾아서 추가",
  "discover.busy": "찾는 중…",
  "discover.history": "추가 기록",
  "discover.none": "새 항목 없음",
  "discover.kind.trends": "트렌드",
  "discover.kind.research": "리서치",
  "discover.toast.searching": "{kind} 찾는 중…",
  "discover.toast.none": "새 항목을 찾지 못했습니다",
  "discover.toast.skipped": "새 항목 없음 (이미 있거나 스킵 {n})",
  "discover.toast.added":
    "추가됨 {n}건 · Compose에서 「업데이트 반영」으로 믹서에 반영",
  "trends.title": "트렌드",
  "trends.lede":
    "Compose에서 쓰는 트렌드 카탈로그(읽기 전용). 컨셉 프롬프트를 복사하세요. AI 추가는 /admin.",
  "research.title": "리서치",
  "research.lede":
    "Compose에서 쓰는 리서치 필러(읽기 전용). 컨셉 프롬프트를 복사하세요. AI 추가는 /admin.",
  "catalog.researchHeading": "리서치 필러",
  "catalog.trendsHeading": "트렌드 카탈로그",
  "catalog.researchIntro":
    "읽기 전용. 필러 프롬프트를 복사해 에이전트 브리프에 붙여넣으세요.",
  "catalog.trendsIntro":
    "읽기 전용. 트렌드 프롬프트를 복사해 에이전트 브리프에 붙여넣으세요.",
  "catalog.applySuffix": "에서 적용.",
  "catalog.new": "신규",
  "catalog.source": "출처",
  "catalog.when": "언제",
  "catalog.skip": "스킵",
  "catalog.useInCompose": "Compose에서 사용 →",
  "catalog.copyPrompt": "프롬프트 복사",
  "catalog.copied": "복사됨",
  "doc.title": "design.md",
  "doc.eyebrow": "캐논",
  "doc.introEn":
    "Full Signal Field guidelines — the underlying system document. Compose Download kit (zip) bundles this file with tokens.css + theme.css.",
  "doc.introKo":
    "아래 본문(design.md)은 영문 가이드라인입니다. UI 크롬은 KO/EN으로 전환할 수 있습니다. 사용법은 USAGE.md · Compose에서 키트 zip을 내려받으세요.",
  "doc.canonical": "정규 가이드라인",
  "doc.canonicalDesc":
    "아래 전체 design.md — 철학, 파운데이션, 컴포넌트, 반응형, 트렌드.",
  "doc.export": "Compose → zip 키트",
  "doc.exportDesc": "한 번에: design.md + tokens.css + theme.css.",
  "doc.document": "문서",
  "doc.exportKicker": "내보내기",
  "foundations.title": "파운데이션",
  "foundations.lede":
    "컬러 역할, 타이포, 여백, 반응형, 모션, 접근성 규범.",
  "components.title": "컴포넌트",
  "components.lede": "버튼·필드·포커스 — 장식보다 상태.",
  "saved.title": "저장된 믹스",
  "saved.empty": "저장된 믹스 없음 — Compose에서 저장하세요.",
  "saved.load": "Compose에서 열기",
  "notfound.eyebrow": "404",
  "notfound.title": "페이지를 찾을 수 없습니다",
  "notfound.lede":
    "Signal Field에 없는 경로입니다. 홈으로 가거나 Compose·가이드라인을 열어보세요.",
  "notfound.home": "홈으로",
  "notfound.compose": "Compose 열기",
  "notfound.doc": "design.md 읽기",
};


export const messages: Record<Locale, Record<MessageKey, string>> = {
  en: en as Record<MessageKey, string>,
  ko,
};

export function t(
  locale: Locale,
  key: MessageKey,
  vars?: Record<string, string | number>
) {
  let s = messages[locale][key] ?? messages.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.split(`{${k}}`).join(String(v));
    }
  }
  return s;
}

export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "ko";
  const lang = (navigator.language || "").toLowerCase();
  if (lang.startsWith("en")) return "en";
  return "ko";
}
