import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { PageChrome } from "@/components/PageChrome";
import { RecommendClient } from "@/components/RecommendClient";

export const metadata: Metadata = { title: "Recommend" };

export default function RecommendPage() {
  return (
    <AppShell current="/recommend">
      <PageChrome
        eyebrowKey="page.tools"
        titleKey="recommend.title"
        ledeKey="recommend.lede"
      />
      <RecommendClient />
    </AppShell>
  );
}
