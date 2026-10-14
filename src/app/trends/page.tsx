import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DiscoverPanel } from "@/components/DiscoverPanel";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Trends" };
export const dynamic = "force-dynamic";

export default function TrendsPage() {
  return (
    <AppShell current="/trends">
      <PageHeader eyebrow="Discover" title="Trends">
        <p>
          정적 목록을 고르지 마세요. AI가 컨셉에 맞는 트렌드를 찾아{" "}
          <code>content/additions/trends.json</code>에 추가합니다. Compose에서{" "}
          <Link href="/compose">업데이트 반영</Link>.
        </p>
      </PageHeader>
      <DiscoverPanel axis="trends" />
    </AppShell>
  );
}
