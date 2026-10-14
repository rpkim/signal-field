"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import styles from "./AxisCatalog.module.css";

export type ResearchCatalogItem = {
  id: string;
  title: string;
  year?: number;
  source?: string;
  implications?: string[];
  ruleDeltas?: Record<string, string>;
  prompt?: string;
  origin?: string;
};

export type TrendCatalogItem = {
  id: string;
  category: string;
  en: string;
  ko: string;
  what: string;
  when: string;
  skip: string;
  logDate?: string;
  prompt?: string;
  origin?: string;
};

type TrendCategory = { id: string; en: string; ko: string };

type Props =
  | {
      axis: "research";
      items: ResearchCatalogItem[];
      categories?: never;
    }
  | {
      axis: "trends";
      items: TrendCatalogItem[];
      categories: TrendCategory[];
    };

export function AxisCatalog(props: Props) {
  const { locale, t } = useLocale();
  const { axis, items } = props;
  const [copied, setCopied] = useState<string | null>(null);

  async function copyPrompt(id: string, prompt: string) {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(id);
      window.setTimeout(() => setCopied((c) => (c === id ? null : c)), 1600);
    } catch {
      setCopied(null);
    }
  }

  function CopyBtn({ id, prompt }: { id: string; prompt: string }) {
    if (!prompt) return null;
    return (
      <button
        type="button"
        className={styles.copy}
        onClick={() => void copyPrompt(id, prompt)}
      >
        {copied === id ? t("catalog.copied") : t("catalog.copyPrompt")}
      </button>
    );
  }

  return (
    <section className={styles.root} aria-labelledby={`${axis}-catalog-heading`}>
      <header className={styles.head}>
        <h2 id={`${axis}-catalog-heading`} className={styles.title}>
          {axis === "research"
            ? t("catalog.researchHeading")
            : t("catalog.trendsHeading")}
        </h2>
        <p className={styles.lede}>
          {axis === "research"
            ? t("catalog.researchIntro")
            : t("catalog.trendsIntro")}
        </p>
      </header>

      {axis === "research" ? (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id} className={styles.card}>
              <div className={styles.cardTop}>
                <h3>
                  {item.title}
                  {item.origin === "ai" ? (
                    <span className={styles.badgeNew}>{t("catalog.new")}</span>
                  ) : null}
                </h3>
                <code className={styles.id}>{item.id}</code>
              </div>
              {item.year || item.source ? (
                <p className={styles.meta}>
                  {item.year ? <span>{item.year}</span> : null}
                  {item.source ? (
                    <a href={item.source} target="_blank" rel="noreferrer">
                      {t("catalog.source")}
                    </a>
                  ) : null}
                </p>
              ) : null}
              {item.implications?.length ? (
                <ul className={styles.bullets}>
                  {item.implications.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : null}
              <p className={styles.actions}>
                <CopyBtn id={item.id} prompt={item.prompt || ""} />
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.trendGroups}>
          {props.categories.map((cat) => {
            const group = items.filter((i) => i.category === cat.id);
            if (!group.length) return null;
            return (
              <section key={cat.id} className={styles.group}>
                <h3 className={styles.groupTitle}>
                  {locale === "ko" ? cat.ko || cat.en : cat.en}
                </h3>
                <ul className={styles.list}>
                  {group.map((item) => (
                    <li key={item.id} className={styles.card}>
                      <div className={styles.cardTop}>
                        <h3>
                          {locale === "ko" ? item.ko || item.en : item.en}
                          {item.origin === "ai" ? (
                            <span className={styles.badgeNew}>
                              {t("catalog.new")}
                            </span>
                          ) : null}
                        </h3>
                        <code className={styles.id}>{item.id}</code>
                      </div>
                      <p className={styles.what}>{item.what}</p>
                      <p className={styles.meta}>
                        <span>
                          {t("catalog.when")}: {item.when}
                        </span>
                        <span>
                          {t("catalog.skip")}: {item.skip}
                        </span>
                      </p>
                      <p className={styles.actions}>
                        <CopyBtn id={item.id} prompt={item.prompt || ""} />
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}
