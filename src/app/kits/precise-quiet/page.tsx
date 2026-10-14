import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Specimen } from "@/components/Specimen";
import styles from "@/styles/pages.module.css";

export const metadata: Metadata = { title: "precise-quiet kit" };

export default function PreciseQuietKitPage() {
  return (
    <AppShell current="/kits/precise-quiet">
      <PageHeader eyebrow="Brand kit" title="precise-quiet">
        <p>
          Default Signal Field kit — IBM Plex Sans/Mono, signal teal on paper
          graphite. Specimen below; open Compose to remix.
        </p>
      </PageHeader>

      <section className={styles.section}>
        <Specimen
          title="precise-quiet"
          meta="signal-teal · plex · default"
          swatches={["#12141a", "#f6f7f8", "#0f766e", "#14b8a6", "#e8eaee"]}
        />
      </section>

      <section className={styles.section}>
        <h2>Recipe</h2>
        <div className={styles.tableWrap}>
          <table className={styles.spec}>
            <tbody>
              <tr>
                <th>Color</th>
                <td>
                  <code>signal-teal</code>
                </td>
              </tr>
              <tr>
                <th>Type</th>
                <td>
                  <code>plex</code> — IBM Plex Sans + Mono
                </td>
              </tr>
              <tr>
                <th>Density</th>
                <td>
                  <code>default</code>
                </td>
              </tr>
              <tr>
                <th>Research</th>
                <td>wcag-22 · m3-roles · fluid-type</td>
              </tr>
              <tr>
                <th>References</th>
                <td>ibm-lang</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.ctaRow}>
          <Link href="/compose?preset=precise-quiet">Open in Compose →</Link>
        </div>
      </section>
    </AppShell>
  );
}
