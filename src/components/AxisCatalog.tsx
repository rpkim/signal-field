"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import type { DiscoverAxis } from "@/lib/discover/types";
import styles from "./AxisCatalog.module.css";

export type ResearchCatalogItem = {
  id: string;
  title: string;
  year?: number;
  source?: string;
  implications?: string[];
  ruleDeltas?: Record<string, string>;
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
};

type TrendCategory = { id: string; en: string; ko: string };

type Props =
  | {
      axis: "research";
      items: ResearchCatalogItem[];
      baseIds: string[];
      categories?: never;
    }
  | {
      axis: "trends";
      items: TrendCatalogItem[];
      baseIds: string[];
      categories: TrendCategory[];
    };

export function AxisCatalog(props: Props) {
  const { locale, t } = useLocale();
  const { axis, items, baseIds } = props;
  const base = new Set(baseIds);

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
          {" — "}
          <Link href="/compose">{t("nav.compose")}</Link>
          {t("catalog.applySuffix")}
        </p>
      </header>

      {axis === "research" ? (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id} className={styles.card}>
              <div className={styles.cardTop}>
                <h3>
                  {item.title}
                  {!base.has(item.id) ? (
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
                <Link
                  href={`/compose?research=${encodeURIComponent(item.id)}`}
                  className={styles.apply}
                >
                  {t("catalog.useInCompose")}
                </Link>
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
                          {!base.has(item.id) ? (
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
                        <Link
                          href={`/compose?trends=${encodeURIComponent(item.id)}`}
                          className={styles.apply}
                        >
                          {t("catalog.useInCompose")}
                        </Link>
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

export type { DiscoverAxis };
