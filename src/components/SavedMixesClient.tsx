"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import type { SavedMix } from "@/lib/types";
import styles from "@/styles/pages.module.css";

export function SavedMixesClient({ items }: { items: SavedMix[] }) {
  const { t } = useLocale();
  return (
    <section className={styles.section} aria-labelledby="saved-mixes">
      <h2 id="saved-mixes">{t("saved.title")}</h2>
      {items.length === 0 ? (
        <p>{t("saved.empty")}</p>
      ) : (
        <ul className={styles.listPlain}>
          {items.map((item) => (
            <li key={item.id}>
              <span className={styles.meta}>
                {new Date(item.createdAt).toLocaleString()}
              </span>
              <strong>{item.name}</strong>
              <p style={{ margin: "0.35rem 0 0", fontSize: "var(--text-sm)" }}>
                {item.mix.color} · {item.mix.type} · {item.mix.density}
              </p>
              <p style={{ margin: "0.35rem 0 0" }}>
                <Link href={`/compose?save=${item.id}`}>{t("saved.load")}</Link>
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
