"use client";

import { PageHeader } from "./PageHeader";
import { useLocale } from "@/i18n/LocaleProvider";

export function ComposeHeader() {
  const { t } = useLocale();
  return (
    <PageHeader eyebrow={t("page.tools")} title={t("compose.title")}>
      <p>{t("compose.lede")}</p>
    </PageHeader>
  );
}
