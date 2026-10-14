import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import trends from "@/data/trends.json";
import styles from "@/styles/pages.module.css";

export const metadata: Metadata = { title: "Trends" };

export default function TrendsPage() {
  const cats = Object.fromEntries(
    trends.categories.map((c) => [c.id, c.en])
  );

  return (
    <AppShell current="/trends">
      <PageHeader eyebrow="Canon" title="Trends">
        <p>
          Friendly index of current visual trends. Canonical append-only log
          remains in{" "}
          <Link href="/doc">design.md §9</Link>.
        </p>
      </PageHeader>

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
