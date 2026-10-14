import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import styles from "@/styles/pages.module.css";

export const metadata: Metadata = { title: "Foundations" };

export default function FoundationsPage() {
  return (
    <AppShell current="/foundations">
      <PageHeader eyebrow="Guide" title="Foundations">
        <p>
          Tokens first: paper field, graphite ink, one teal signal. Type is IBM
          Plex Sans with Mono for code — weight and space carry hierarchy.
        </p>
      </PageHeader>

      <section className={styles.section}>
        <h2>Color roles</h2>
        <div
          className={styles.swatchRow}
          aria-label="Default signal teal swatches"
        >
          <span style={{ background: "#12141a" }} />
          <span style={{ background: "#f6f7f8" }} />
          <span style={{ background: "#0f766e" }} />
          <span style={{ background: "#14b8a6" }} />
          <span style={{ background: "#e8eaee" }} />
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.spec}>
            <thead>
              <tr>
                <th>Token</th>
                <th>Role</th>
                <th>Never</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>--color-ink</code>
                </td>
                <td>Primary text and chrome fill</td>
                <td>Low-contrast gray body copy</td>
              </tr>
              <tr>
                <td>
                  <code>--color-field</code>
                </td>
                <td>Page paper plane</td>
                <td>Flat white with no atmosphere</td>
              </tr>
              <tr>
                <td>
                  <code>--color-signal</code>
                </td>
                <td>Single accent family</td>
                <td>Second purple or blue SaaS accent</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Type</h2>
        <p>
          Display and body share IBM Plex Sans. Mono is IBM Plex Mono. Tracking
          on display is slight (−0.015em). No novelty display fonts in the shell.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Space & radius</h2>
        <p>
          Prefer open lists and hairline rules over card farms. Radius stays
          modest (<code>--radius-md</code>). Section rhythm uses large vertical
          steps from the space scale.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Focus & motion</h2>
        <div className={styles.row}>
          <Button type="button">Focus me</Button>
          <Button type="button" variant="ghost">
            Ghost
          </Button>
        </div>
        <p style={{ marginTop: "1rem" }}>
          Focus ring uses chalk + signal. Honor{" "}
          <code>prefers-reduced-motion</code>. Motion is for hierarchy, not noise.
        </p>
      </section>
    </AppShell>
  );
}
