import type { Metadata } from "next";
import { readFile } from "fs/promises";
import path from "path";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import styles from "@/styles/pages.module.css";

export const metadata: Metadata = { title: "design.md" };

async function loadDoc() {
  const file = path.join(process.cwd(), "content", "design.md");
  return readFile(file, "utf8");
}

export default async function DocPage() {
  const md = await loadDoc();

  return (
    <AppShell current="/doc">
      <PageHeader eyebrow="Canon" title="design.md">
        <p>
          Canonical guidelines copied into <code>content/</code> for the app.
          Store docs remain the source of truth.
        </p>
      </PageHeader>
      <article className={styles.prose}>{md}</article>
    </AppShell>
  );
}
