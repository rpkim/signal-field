import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import references from "@/data/references.json";
import research from "@/data/research.json";
import styles from "@/styles/pages.module.css";

export const metadata: Metadata = { title: "Research" };

export default function ResearchPage() {
  return (
    <AppShell current="/research">
      <PageHeader eyebrow="Canon" title="Research">
        <p>
          Pillars that constrain Compose. Pair with reference sites — steal
          systems, not skins.
        </p>
      </PageHeader>

      <section className={styles.section}>
        <h2>Pillars</h2>
        <ul className={styles.listPlain}>
          {research.items.map((item) => (
            <li key={item.id}>
              <span className={styles.meta}>
                {item.year}
                {item.source ? " · source" : ""}
              </span>
              <strong>{item.title}</strong>
              <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1.1rem" }}>
                {item.implications.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>References</h2>
        <ul className={styles.listPlain}>
          {references.items.map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong>
              <p style={{ margin: "0.35rem 0 0" }}>
                Steal: {item.steal}
                <br />
                Don&apos;t: {item.dont}
              </p>
              {item.url ? (
                <p style={{ margin: "0.35rem 0 0", fontSize: "var(--text-sm)" }}>
                  <a href={item.url} rel="noreferrer" target="_blank">
                    {item.url}
                  </a>
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
