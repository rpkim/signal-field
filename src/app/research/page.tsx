import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DiscoverPanel } from "@/components/DiscoverPanel";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Research" };
export const dynamic = "force-dynamic";

export default function ResearchPage() {
  return (
    <AppShell current="/research">
      <PageHeader eyebrow="Discover" title="Research">
        <p>
          리서치 카드를 브라우징하지 마세요. AI가 관련 필러를 찾아{" "}
          <code>content/additions/research.json</code>에 추가합니다. Compose에서{" "}
          <Link href="/compose">업데이트 반영</Link>.
        </p>
      </PageHeader>
      <DiscoverPanel axis="research" />
    </AppShell>
  );
}
