import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { DiscoverPanel } from "@/components/DiscoverPanel";
import { PageChrome } from "@/components/PageChrome";

export const metadata: Metadata = { title: "Trends" };
export const dynamic = "force-dynamic";

export default function TrendsPage() {
  return (
    <AppShell current="/trends">
      <PageChrome
        eyebrowKey="page.discover"
        titleKey="trends.title"
        ledeKey="trends.lede"
      />
      <DiscoverPanel axis="trends" />
    </AppShell>
  );
}
