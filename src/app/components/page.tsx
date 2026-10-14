import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { ComponentsBoard } from "@/components/ComponentsBoard";
import { PageChrome } from "@/components/PageChrome";

export const metadata: Metadata = { title: "Components" };

export default function ComponentsPage() {
  return (
    <AppShell current="/components">
      <PageChrome
        eyebrowKey="page.guide"
        titleKey="components.title"
        ledeKey="components.lede"
      />
      <ComponentsBoard />
    </AppShell>
  );
}
