"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const { t } = useLocale();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p>{t("footer.note")}</p>
      </div>
    </footer>
  );
}
