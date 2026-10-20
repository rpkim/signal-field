import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import {
  AxisCatalog,
  type ResearchCatalogItem,
} from "@/components/AxisCatalog";
import { DiscoverPanel } from "@/components/DiscoverPanel";
import { PageChrome } from "@/components/PageChrome";
import { getResearchCatalog } from "@/lib/discover/catalog";

export const metadata: Metadata = { title: "Research" };
export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const catalog = await getResearchCatalog();
  const baseIds = catalog.items
    .filter((item) => item.origin === "seed")
    .map((item) => item.id);

  return (
    <AppShell current="/research">
      <PageChrome
        eyebrowKey="page.canon"
        titleKey="research.title"
        ledeKey="research.lede"
      />
      <AxisCatalog
        axis="research"
        items={catalog.items as ResearchCatalogItem[]}
        baseIds={baseIds}
      />
      <DiscoverPanel />
    </AppShell>
  );
}
