import type { Metadata } from "next";
import { readFile } from "fs/promises";
import path from "path";
import { marked } from "marked";
import { AppShell } from "@/components/AppShell";
import { DocIntro } from "@/components/DocIntro";
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
      <DocIntro />
      <SavedMixes />
      <article
        id="canonical-guidelines"
        className={styles.doc}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </AppShell>
  );
}
