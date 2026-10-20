import type { Metadata } from "next";
import { AdminClient } from "@/components/AdminClient";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <AppShell current="/admin">
      <PageHeader eyebrow="Local" title="Catalog">
        <p>
          Trends and research live in the local database. A search lists drafts
          only — an item is saved when you choose Add.
        </p>
      </PageHeader>
      <AdminClient />
    </AppShell>
  );
}
