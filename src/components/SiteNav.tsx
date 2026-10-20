"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import type { MessageKey } from "@/i18n/messages";
import { LocaleSwitcher } from "./LocaleSwitcher";
import styles from "./SiteNav.module.css";

type NavItem = { href: string; labelKey: MessageKey; group?: string };

const primary: NavItem[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/foundations", labelKey: "nav.foundations" },
  { href: "/components", labelKey: "nav.components" },
  { href: "/compose", labelKey: "nav.compose", group: "tools" },
  { href: "/trends", labelKey: "nav.trends", group: "canon" },
  { href: "/research", labelKey: "nav.research", group: "canon" },
  { href: "/doc", labelKey: "nav.doc", group: "doc" },
];

export function SiteNav({ current }: { current?: string }) {
  const { t } = useLocale();
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
          Signal Field <span>{t("brand.guidelines")}</span>
        </Link>
        <div className={styles.actions}>
          <LocaleSwitcher />
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? t("nav.close") : t("nav.menu")}
          </button>
        </div>
        <nav
          id={panelId}
          className={[styles.nav, open ? styles.navOpen : ""]
            .filter(Boolean)
            .join(" ")}
          aria-label={t("nav.primary")}
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
                  {t(item.labelKey)}
                </Link>
              </span>
            );
          })}
          <span className={styles.localeDesktop}>
            <LocaleSwitcher />
          </span>
        </nav>
      </div>
    </header>
  );
}
