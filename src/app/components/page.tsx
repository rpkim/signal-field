import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { PageChrome } from "@/components/PageChrome";
import { Specimen } from "@/components/Specimen";
import styles from "@/styles/pages.module.css";

export const metadata: Metadata = { title: "Components" };

export default function ComponentsPage() {
  return (
    <AppShell current="/components">
      <PageChrome eyebrowKey="page.guide" titleKey="components.title" ledeKey="components.lede" />

      <section className={styles.section}>
        <h2>Button</h2>
        <div className={styles.row}>
          <Button type="button">Primary</Button>
          <Button type="button" variant="ghost">
            Ghost
          </Button>
          <Button type="button" variant="danger">
            Danger
          </Button>
          <Button type="button" disabled>
            Disabled
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Field</h2>
        <div className={styles.stack}>
          <Field id="name" label="Workspace" hint="Shown in the top bar.">
            <input id="name" defaultValue="Harbor Desk" />
          </Field>
          <Field id="tier" label="Tier">
            <select id="tier" defaultValue="team">
              <option value="solo">Solo</option>
              <option value="team">Team</option>
            </select>
          </Field>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Specimen</h2>
        <Specimen
          title="Component board"
          meta="signal-teal · plex · default"
          swatches={["#12141a", "#f6f7f8", "#0f766e", "#14b8a6", "#e8eaee"]}
        />
      </section>
    </AppShell>
  );
}
