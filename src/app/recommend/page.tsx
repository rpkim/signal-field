import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { RecommendClient } from "@/components/RecommendClient";

export const metadata: Metadata = { title: "Recommend" };

export default function RecommendPage() {
  return (
    <AppShell current="/recommend">
      <PageHeader eyebrow="Tools" title="Recommend">
        <p>
          Describe the service. Heuristics rank theme mixes against the option
          catalogs — open the winner in Compose.
        </p>
      </PageHeader>
      <RecommendClient />
    </AppShell>
  );
}
