import type { Metadata } from "next";
import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { ComposeClient } from "@/components/ComposeClient";
import { ComposeHeader } from "@/components/ComposeHeader";

export const metadata: Metadata = { title: "Compose" };

export default function ComposePage() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <AppShell current="/compose">
        <ComposeHeader />
        <Suspense fallback={<p>…</p>}>
          <ComposeClient />
        </Suspense>
      </AppShell>
    </>
  );
}
