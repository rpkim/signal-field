"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import type { DiscoverAxis } from "@/lib/discover/types";
import { Button } from "./Button";
import styles from "./DiscoverPanel.module.css";

type Props = { axis: DiscoverAxis; onAdded?: () => void };

type HistoryEntry = {
  at: string;
  mode?: string;
  provider?: string;
  added: Array<{ id: string; label: string }>;
  skipped: Array<{ id: string; reason: string }>;
  error?: string;
};

export function DiscoverPanel({ axis, onAdded }: Props) {
  const { t } = useLocale();
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const kind =
    axis === "trends" ? t("discover.kind.trends") : t("discover.kind.research");
  const placeholder =
    axis === "trends"
      ? "quiet commerce, fluid type…"
      : "WCAG focus appearance…";

  async function ingest(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setToast(t("discover.toast.searching", { kind }));
    try {
      const res = await fetch("/api/discover/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ axis, topic, notes: "" }),
      });
      const data = (await res.json()) as {
        error?: string;
        mode?: string;
        provider?: string;
        added?: Array<{ id: string; label: string }>;
        skipped?: Array<{ id: string; reason: string }>;
      };
      if (!res.ok) throw new Error(data.error || "Ingest failed");

      const added = data.added || [];
      const skipped = data.skipped || [];
      setHistory((prev) =>
        [
          {
            at: new Date().toISOString(),
            mode: data.mode,
            provider: data.provider,
            added,
            skipped,
          },
          ...prev,
        ].slice(0, 8)
      );

      if (added.length === 0) {
        setToast(
          skipped.length
            ? t("discover.toast.skipped", { n: skipped.length })
            : t("discover.toast.none")
        );
      } else {
        setToast(t("discover.toast.added", { n: added.length }));
        onAdded?.();
      }
      router.refresh();
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Ingest failed");
      setHistory((prev) =>
        [
          {
            at: new Date().toISOString(),
            added: [],
            skipped: [],
            error: err instanceof Error ? err.message : "Ingest failed",
          },
          ...prev,
        ].slice(0, 8)
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.hero} aria-labelledby="discover-heading">
      <h2 id="discover-heading" className={styles.title}>
        {t("discover.aiTitle")}
      </h2>
      <p className={styles.intro}>
        {t("discover.aiIntro", { kind })}{" "}
        <Link href="/compose">{t("nav.compose")}</Link>.
      </p>

      <form className={styles.form} onSubmit={ingest}>
        <label htmlFor={`discover-topic-${axis}`} className={styles.topicLabel}>
          {t("discover.topic")} <span>{t("discover.optional")}</span>
          <input
            id={`discover-topic-${axis}`}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={placeholder}
            disabled={busy}
          />
        </label>
        <div className={styles.actions}>
          <Button type="submit" disabled={busy} className={styles.primary}>
            {busy ? t("discover.busy") : t("discover.button")}
          </Button>
        </div>
      </form>

      {toast ? (
        <p className={styles.toast} role="status" aria-live="polite">
          {toast}
        </p>
      ) : null}

      {history.length ? (
        <div className={styles.history}>
          <h3>{t("discover.history")}</h3>
          <ul>
            {history.map((h) => (
              <li key={h.at}>
                <span className={styles.when}>
                  {new Date(h.at).toLocaleString()}
                  {h.mode ? ` · ${h.mode}` : ""}
                  {h.provider ? ` · ${h.provider}` : ""}
                </span>
                {h.error ? (
                  <p className={styles.err}>{h.error}</p>
                ) : h.added.length ? (
                  <ul className={styles.added}>
                    {h.added.map((a) => (
                      <li key={a.id}>
                        <code>{a.id}</code> — {a.label}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.empty}>{t("discover.none")}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
