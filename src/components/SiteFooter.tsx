import Link from "next/link";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Link href="/trends">Trends</Link>
        <span aria-hidden>·</span>
        <Link href="/research">Research</Link>
        <span aria-hidden>·</span>
        <Link href="/kits/precise-quiet">precise-quiet</Link>
        <span aria-hidden>·</span>
        <Link href="/doc">design.md</Link>
      </div>
    </footer>
  );
}
