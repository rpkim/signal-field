"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import styles from "./LocaleSwitcher.module.css";

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useLocale();
  return (
    <div className={styles.switch} role="group" aria-label={t("locale.label")}>
      <button
        type="button"
        className={locale === "ko" ? styles.active : undefined}
        aria-pressed={locale === "ko"}
        onClick={() => setLocale("ko")}
      >
        {t("locale.ko")}
      </button>
      <button
        type="button"
        className={locale === "en" ? styles.active : undefined}
        aria-pressed={locale === "en"}
        onClick={() => setLocale("en")}
      >
        {t("locale.en")}
      </button>
    </div>
  );
}
