"use client";

import Link from "next/link";
import references from "@/data/references.json";
import { useLocale } from "@/i18n/LocaleProvider";
import type { DiscoverAxis } from "@/lib/discover/types";
import styles from "./AxisCatalog.module.css";

const referenceLinks = new Map(
  references.items.map((item) => [item.id, { href: item.url, label: item.title }])
);

function linkLabel(href: string) {
  try {
    const url = new URL(href);
    const path = url.pathname === "/" ? "" : url.pathname.replace(/\/$/, "");
    return `${url.hostname.replace(/^www\./, "")}${path}`;
  } catch {
    return href;
  }
}

function sourceLinks(item: { sources?: string[]; refs?: string[] }) {
  const hrefs = [
    ...(item.sources || []),
    ...(item.refs || []).flatMap((id) => {
      const ref = referenceLinks.get(id);
      return ref ? [ref.href] : [];
    }),
  ];
  const seen = new Set<string>();
  return hrefs
    .map((href) => href.trim())
    .filter((href) => {
      if (!/^https?:\/\//i.test(href) || seen.has(href)) return false;
      seen.add(href);
      return true;
    })
    .map((href) => {
      const named = [...referenceLinks.values()].find((ref) => ref.href === href);
      return { href, label: named?.label || linkLabel(href) };
    });
}

export type ResearchCatalogItem = {
  id: string;
  title: string;
  year?: number;
  source?: string;
  sources?: string[];
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
  sources?: string[];
  refs?: string[];
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
          {items
            .slice()
            .sort((a, b) => (b.year || 0) - (a.year || 0) || a.title.localeCompare(b.title))
            .map((item) => {
              const links = sourceLinks({
                sources: item.sources?.length ? item.sources : item.source ? [item.source] : [],
              });
              return (
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
              {item.year || links.length ? (
                <p className={styles.meta}>
                  {item.year ? <span>{item.year}</span> : null}
                </p>
              ) : null}
              {links.length ? (
                <ul className={styles.sources}>
                  {links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
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
              );
            })}
        </ul>
      ) : (
        <div className={styles.trendGroups}>
          {props.categories.map((cat) => {
            const group = items
              .filter((i) => i.category === cat.id)
              .slice()
              .sort((a, b) => (b.logDate || "").localeCompare(a.logDate || ""));
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
                        {item.logDate ? (
                          <span>
                            {t("catalog.logged")}: <time dateTime={item.logDate}>{item.logDate}</time>
                          </span>
                        ) : null}
                        <span>
                          {t("catalog.when")}: {item.when}
                        </span>
                        <span>
                          {t("catalog.skip")}: {item.skip}
                        </span>
                      </p>
                      {sourceLinks(item).length ? (
                        <ul className={styles.sources}>
                          {sourceLinks(item).map((link) => (
                            <li key={link.href}>
                              <a href={link.href} target="_blank" rel="noreferrer">
                                {link.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : null}
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
