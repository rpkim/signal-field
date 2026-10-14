import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DiscoverPanel } from "@/components/DiscoverPanel";
import { PageHeader } from "@/components/PageHeader";
import { getTrendsCatalog } from "@/lib/discover/catalog";
import styles from "@/styles/pages.module.css";

export const metadata: Metadata = { title: "Trends" };
export const dynamic = "force-dynamic";

export default async function TrendsPage() {
  const trends = await getTrendsCatalog();
  const cats = Object.fromEntries(
    trends.categories.map((c) => [c.id, c.en])
  );

  return (
    <AppShell current="/trends">
      <PageHeader eyebrow="Canon" title="Trends">
        <p>
          Friendly index of current visual trends. Canonical append-only log
          remains in <Link href="/doc">design.md §9</Link>. AI additions persist
          under <code>content/additions/trends.json</code>.
        </p>
      </PageHeader>

      <DiscoverPanel axis="trends" />

      <ul className={styles.listPlain}>
        {trends.items.map((item) => (
          <li key={item.id}>
            <span className={styles.meta}>
              {cats[item.category] ?? item.category}
              {item.logDate ? ` · ${item.logDate}` : ""}
            </span>
            <strong>
              {item.en}
              {item.ko ? ` · ${item.ko}` : ""}
            </strong>
            <p style={{ margin: "0.35rem 0 0", color: "var(--color-ink-soft)" }}>
              {item.what}
            </p>
            <p style={{ margin: "0.35rem 0 0", fontSize: "var(--text-sm)" }}>
              When: {item.when} — Skip: {item.skip}
            </p>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
