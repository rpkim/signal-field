import Link from "next/link";
import styles from "./SiteNav.module.css";

const primary = [
  { href: "/", label: "Home" },
  { href: "/foundations", label: "Foundations" },
  { href: "/components", label: "Components" },
  { href: "/compose", label: "Compose", group: "tools" },
  { href: "/recommend", label: "Recommend", group: "tools" },
  { href: "/rebrand", label: "Rebrand", group: "tools" },
  { href: "/trends", label: "Trends", group: "canon" },
  { href: "/research", label: "Research", group: "canon" },
  { href: "/doc", label: "Doc", group: "doc" },
] as const;

export function SiteNav({ current }: { current?: string }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          Signal Field <span>Guidelines</span>
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          {primary.map((item, i) => {
            const prev = primary[i - 1];
            const showSep =
              item.group && (!prev || prev.group !== item.group) && i > 0;
            return (
              <span key={item.href} className={styles.item}>
                {showSep ? <span className={styles.sep} aria-hidden /> : null}
                <Link
                  href={item.href}
                  aria-current={current === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </span>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
