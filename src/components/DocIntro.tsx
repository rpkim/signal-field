"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { PageHeader } from "./PageHeader";
import styles from "@/styles/pages.module.css";

export function DocIntro() {
  const { t, locale } = useLocale();
  return (
    <>
      <PageHeader eyebrow={t("doc.eyebrow")} title={t("doc.title")}>
        <p>{locale === "ko" ? t("doc.introKo") : t("doc.introEn")}</p>
        <p style={{ marginTop: "0.75rem" }}>
          <Link href="https://github.com/rpkim/signal-field/blob/main/USAGE.md">
            USAGE.md
          </Link>
        </p>
      </PageHeader>

      <nav className={styles.homeGrid} aria-label="Doc">
        <a href="#canonical-guidelines">
          <span className={styles.kicker}>{t("doc.document")}</span>
          <span>
            <span className={styles.gridTitle}>{t("doc.canonical")}</span>
            <p className={styles.gridDesc}>{t("doc.canonicalDesc")}</p>
          </span>
        </a>
        <Link href="/compose">
          <span className={styles.kicker}>{t("doc.exportKicker")}</span>
          <span>
            <span className={styles.gridTitle}>{t("doc.export")}</span>
            <p className={styles.gridDesc}>{t("doc.exportDesc")}</p>
          </span>
        </Link>
      </nav>
    </>
  );
}
