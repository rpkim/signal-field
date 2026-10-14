"use client";

import { PageHeader } from "./PageHeader";
import { useLocale } from "@/i18n/LocaleProvider";
import type { MessageKey } from "@/i18n/messages";

export function PageChrome({
  eyebrowKey,
  titleKey,
  ledeKey,
  children,
}: {
  eyebrowKey: MessageKey;
  titleKey: MessageKey;
  ledeKey: MessageKey;
  children?: React.ReactNode;
}) {
  const { t } = useLocale();
  return (
    <PageHeader eyebrow={t(eyebrowKey)} title={t(titleKey)}>
      <p>{t(ledeKey)}</p>
      {children}
    </PageHeader>
  );
}
