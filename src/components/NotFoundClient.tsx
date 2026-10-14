"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import styles from "./NotFound.module.css";

const shortcuts = [
  { href: "/", titleKey: "nav.home" as const, descKey: "home.lede" as const },
  {
    href: "/compose",
    titleKey: "nav.compose" as const,
    descKey: "home.compose.desc" as const,
  },
  {
    href: "/doc",
    titleKey: "nav.doc" as const,
    descKey: "doc.canonicalDesc" as const,
  },
];

export function NotFoundClient() {
  const { t } = useLocale();

  return (
    <div className={styles.panel}>
      <p className={styles.eyebrow}>
        <span className={styles.code}>{t("notfound.eyebrow")}</span>
        Signal Field
      </p>
      <h1 className={styles.title}>{t("notfound.title")}</h1>
      <p className={styles.lede}>{t("notfound.lede")}</p>

      <div className={styles.actions}>
        <Link href="/" className={`${styles.link} ${styles.primary}`}>
          {t("notfound.home")}
        </Link>
        <Link href="/compose" className={`${styles.link} ${styles.ghost}`}>
          {t("notfound.compose")}
        </Link>
        <Link href="/doc" className={`${styles.link} ${styles.ghost}`}>
          {t("notfound.doc")}
        </Link>
      </div>

      <nav className={styles.paths} aria-label={t("home.sections")}>
        <p>{t("home.sections")}</p>
        <ul>
          {shortcuts.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                {t(item.titleKey)}
                <span>{t(item.descKey)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
