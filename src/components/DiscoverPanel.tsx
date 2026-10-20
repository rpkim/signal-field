"use client";

import Link from "next/link";
import styles from "./DiscoverPanel.module.css";

export function DiscoverPanel() {
  return (
    <section className={styles.hero}>
      <h2 className={styles.title}>Catalog</h2>
      <p className={styles.intro}>
        Add, edit, or remove trends and research on{" "}
        <Link href="/admin">Admin</Link>. A search there asks before anything is
        saved.
      </p>
    </section>
  );
}
