"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import type { MessageKey } from "@/i18n/messages";
import styles from "@/styles/pages.module.css";

const links: Array<{
  href: string;
  kicker: MessageKey;
  titleKey: MessageKey;
  desc: MessageKey;
}> = [
  {
    href: "/foundations",
    kicker: "home.kicker.guide",
    titleKey: "nav.foundations",
    desc: "home.foundations.desc",
  },
  {
    href: "/components",
    kicker: "home.kicker.guide",
    titleKey: "nav.components",
    desc: "home.components.desc",
  },
  {
    href: "/compose",
    kicker: "home.kicker.tools",
    titleKey: "nav.compose",
    desc: "home.compose.desc",
  },
  {
    href: "/recommend",
    kicker: "home.kicker.tools",
    titleKey: "nav.recommend",
    desc: "home.recommend.desc",
  },
  {
    href: "/trends",
    kicker: "home.kicker.canon",
    titleKey: "nav.trends",
    desc: "home.trends.desc",
  },
  {
    href: "/research",
    kicker: "home.kicker.canon",
    titleKey: "nav.research",
    desc: "home.research.desc",
  },
  {
    href: "/kits/precise-quiet",
    kicker: "home.kicker.kit",
    titleKey: "nav.compose",
    desc: "home.kit.desc",
  },
];

export function HomeClient() {
  const { t } = useLocale();
  // Fix kit title - use literal precise-quiet
  return (
    <>
      <p className={styles.brand}>Signal Field</p>
      <p className={styles.lede}>{t("home.lede")}</p>

      <section className={styles.section} aria-labelledby="meta">
        <h2 id="meta">{t("home.meta")}</h2>
        <ul className={styles.listPlain}>
          <li>
            <strong>{t("home.clarity")}</strong>
            <p style={{ margin: "0.35rem 0 0" }}>{t("home.clarity.body")}</p>
          </li>
          <li>
            <strong>{t("home.deference")}</strong>
            <p style={{ margin: "0.35rem 0 0" }}>{t("home.deference.body")}</p>
          </li>
          <li>
            <strong>{t("home.depth")}</strong>
            <p style={{ margin: "0.35rem 0 0" }}>{t("home.depth.body")}</p>
          </li>
        </ul>
      </section>

      <nav className={styles.homeGrid} aria-label={t("home.sections")}>
        {links.map((item) => (
          <Link key={item.href} href={item.href}>
            <span className={styles.kicker}>{t(item.kicker)}</span>
            <span>
              <span className={styles.gridTitle}>
                {item.href === "/kits/precise-quiet"
                  ? "precise-quiet"
                  : t(item.titleKey)}
              </span>
              <p className={styles.gridDesc}>{t(item.desc)}</p>
            </span>
          </Link>
        ))}
      </nav>
    </>
  );
}
