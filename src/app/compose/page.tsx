import type { Metadata } from "next";
import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { ComposeClient } from "@/components/ComposeClient";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Compose" };

export default function ComposePage() {
  return (
    <AppShell current="/compose">
      <PageHeader eyebrow="Tools" title="Compose">
        <p>
          Mix research × references × color × type × density. Live specimen on
          the right; download a portable kit when the mix holds.
        </p>
      </PageHeader>
      <Suspense fallback={<p>Loading mixer…</p>}>
        <ComposeClient />
      </Suspense>
    </AppShell>
  );
}
