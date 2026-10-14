import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { DiscoverPanel } from "@/components/DiscoverPanel";
import { PageChrome } from "@/components/PageChrome";

export const metadata: Metadata = { title: "Research" };
export const dynamic = "force-dynamic";

export default function ResearchPage() {
  return (
    <AppShell current="/research">
      <PageChrome
        eyebrowKey="page.discover"
        titleKey="research.title"
        ledeKey="research.lede"
      />
      <DiscoverPanel axis="research" />
    </AppShell>
  );
}
