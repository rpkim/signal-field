"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import styles from "./SiteNav.module.css";

const primary = [
  { href: "/", label: "Home" },
  { href: "/foundations", label: "Foundations" },
  { href: "/components", label: "Components" },
  { href: "/compose", label: "Compose", group: "tools" },
  { href: "/recommend", label: "Recommend", group: "tools" },
  { href: "/trends", label: "Trends", group: "canon" },
  { href: "/research", label: "Research", group: "canon" },
  { href: "/doc", label: "Doc", group: "doc" },
] as const;

export function SiteNav({ current }: { current?: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [current]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
          Signal Field <span>Guidelines</span>
        </Link>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <nav
          id={panelId}
          className={[styles.nav, open ? styles.navOpen : ""].filter(Boolean).join(" ")}
          aria-label="Primary"
        >
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
                  onClick={() => setOpen(false)}
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
