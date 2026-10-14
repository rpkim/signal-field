import type { Metadata } from "next";
import { AdminClient } from "@/components/AdminClient";
import { AppShell } from "@/components/AppShell";
import { isAdminRequest } from "@/lib/adminAuth";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdminRequest();
  return (
    <AppShell current="/admin">
      <AdminClient initiallyAuthed={authed} />
    </AppShell>
  );
}
