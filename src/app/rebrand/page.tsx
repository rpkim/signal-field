import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { RebrandClient } from "@/components/RebrandClient";

export const metadata: Metadata = { title: "Rebrand" };

export default function RebrandPage() {
  return (
    <AppShell current="/rebrand">
      <PageHeader eyebrow="Tools" title="Rebrand">
        <p>
          Analyze existing CSS, map roles to a Signal Field direction, emit a
          hook stylesheet, and preview the Harbor Desk fixture.
        </p>
      </PageHeader>
      <RebrandClient />
    </AppShell>
  );
}
