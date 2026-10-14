import type { Metadata } from "next";
import { readFile } from "fs/promises";
import path from "path";
import Link from "next/link";
import { marked } from "marked";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { SavedMixes } from "@/components/SavedMixes";
import styles from "@/styles/pages.module.css";

export const metadata: Metadata = { title: "design.md" };
export const dynamic = "force-dynamic";

async function loadDoc() {
  const file = path.join(process.cwd(), "content", "design.md");
  return readFile(file, "utf8");
}

export default async function DocPage() {
  const md = await loadDoc();
  const html = await marked.parse(md, { gfm: true, breaks: false });

  return (
    <AppShell current="/doc">
      <PageHeader eyebrow="Canon" title="design.md">
        <p>
          Full Signal Field guidelines — the underlying system document. Also
          see{" "}
          <Link href="https://github.com/rpkim/signal-field/blob/main/USAGE.md">
            USAGE.md
          </Link>{" "}
          for the human/agent playbook. Compose{" "}
          <strong>Download kit (zip)</strong> bundles this file with{" "}
          <code>tokens.css</code> + <code>theme.css</code>.
        </p>
      </PageHeader>

      <nav className={styles.homeGrid} aria-label="Doc sections">
        <a href="#canonical-guidelines">
          <span className={styles.kicker}>Document</span>
          <span>
            <span className={styles.gridTitle}>Canonical guidelines</span>
            <p className={styles.gridDesc}>
              Full design.md below — philosophy, foundations, components,
              responsive, trends.
            </p>
          </span>
        </a>
        <Link href="/compose">
          <span className={styles.kicker}>Export</span>
          <span>
            <span className={styles.gridTitle}>Compose → zip kit</span>
            <p className={styles.gridDesc}>
              One download: design.md + tokens.css + theme.css.
            </p>
          </span>
        </Link>
      </nav>

      <SavedMixes />

      <section
        id="canonical-guidelines"
        className={styles.section}
        aria-labelledby="guidelines-heading"
      >
        <h2 id="guidelines-heading">Canonical guidelines</h2>
        <p>
          Source file: <code>content/design.md</code> (synced with store{" "}
          <code>docs/design.md</code>).
        </p>
        <article
          className={styles.prose}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </section>
    </AppShell>
  );
}
