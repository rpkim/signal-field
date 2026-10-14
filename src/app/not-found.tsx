import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { NotFoundClient } from "@/components/NotFoundClient";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <AppShell>
      <NotFoundClient />
    </AppShell>
  );
}
