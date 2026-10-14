import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { DiscoverPanel } from "@/components/DiscoverPanel";
import { PageHeader } from "@/components/PageHeader";
import { getResearchCatalog } from "@/lib/discover/catalog";
import references from "@/data/references.json";
import styles from "@/styles/pages.module.css";

export const metadata: Metadata = { title: "Research" };
export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const research = await getResearchCatalog();

  return (
    <AppShell current="/research">
      <PageHeader eyebrow="Canon" title="Research">
        <p>
          Pillars that constrain Compose. AI additions persist under{" "}
          <code>content/additions/research.json</code> and appear in the mixer.
        </p>
      </PageHeader>

      <DiscoverPanel axis="research" />

      <section className={styles.section}>
        <h2>Pillars</h2>
        <ul className={styles.listPlain}>
          {research.items.map((item) => (
            <li key={item.id}>
              <span className={styles.meta}>
                {"year" in item ? item.year : ""}
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
