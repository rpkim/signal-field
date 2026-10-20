import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { AxisCatalog, type TrendCatalogItem } from "@/components/AxisCatalog";
import { DiscoverPanel } from "@/components/DiscoverPanel";
import { PageChrome } from "@/components/PageChrome";
import baseTrends from "@/data/trends.json";
import { getTrendsCatalog } from "@/lib/discover/catalog";

export const metadata: Metadata = { title: "Trends" };
export const dynamic = "force-dynamic";

export default async function TrendsPage() {
  const catalog = await getTrendsCatalog();
  const baseIds = catalog.items
    .filter((item) => item.origin === "seed")
    .map((item) => item.id);

  return (
    <AppShell current="/trends">
      <PageChrome
        eyebrowKey="page.canon"
        titleKey="trends.title"
        ledeKey="trends.lede"
      />
      <AxisCatalog
        axis="trends"
        items={catalog.items as TrendCatalogItem[]}
        baseIds={baseIds}
        categories={baseTrends.categories}
      />
      <DiscoverPanel />
    </AppShell>
  );
}
