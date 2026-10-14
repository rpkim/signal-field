import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import {
  AxisCatalog,
  type ResearchCatalogItem,
} from "@/components/AxisCatalog";
import { PageChrome } from "@/components/PageChrome";
import { getResearchCatalog } from "@/lib/discover/catalog";

export const metadata: Metadata = { title: "Research" };
export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const catalog = await getResearchCatalog();

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
      />
    </AppShell>
  );
}
