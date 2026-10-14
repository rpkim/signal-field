"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./Button";
import styles from "./DiscoverPanel.module.css";
import type { DiscoverAxis } from "@/lib/discover/types";

type Props = {
  axis: DiscoverAxis;
};

type HistoryEntry = {
  at: string;
  mode?: string;
  provider?: string;
  added: Array<{ id: string; label: string }>;
  skipped: Array<{ id: string; reason: string }>;
  error?: string;
};

export function DiscoverPanel({ axis }: Props) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const label = axis === "trends" ? "트렌드" : "리서치";
  const placeholder =
    axis === "trends"
      ? "예: quiet commerce, fluid type, deference chrome (비우면 현재 craft 기준)"
      : "예: WCAG focus appearance, fluid type roles (비우면 현재 craft 기준)";

  async function ingest(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setToast(`${label} 찾는 중…`);
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
      const entry: HistoryEntry = {
        at: new Date().toISOString(),
        mode: data.mode,
        provider: data.provider,
        added,
        skipped,
      };
      setHistory((prev) => [entry, ...prev].slice(0, 8));

      if (added.length === 0) {
        setToast(
          skipped.length
            ? `새 항목 없음 (이미 있거나 스킵 ${skipped.length})`
            : "새 항목을 찾지 못했습니다"
        );
      } else {
        setToast(
          `추가됨 ${added.length}건 · Compose에서 「업데이트 반영」으로 믹서에 반영`
        );
      }
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ingest failed";
      setToast(message);
      setHistory((prev) => [
        {
          at: new Date().toISOString(),
          added: [],
          skipped: [],
          error: message,
        },
        ...prev,
      ].slice(0, 8));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.hero} aria-labelledby="discover-heading">
      <h2 id="discover-heading" className={styles.title}>
        AI로 찾아서 추가
      </h2>
      <p className={styles.intro}>
        버튼을 누르면 관련 {label}를 찾아 카탈로그에 <strong>바로 추가</strong>
        합니다. 수동 카드 고르기 없음. Compose →{" "}
        <Link href="/compose">업데이트 반영</Link>으로 믹서에 불러오세요.
      </p>

      <form className={styles.form} onSubmit={ingest}>
        <label htmlFor={`discover-topic-${axis}`} className={styles.topicLabel}>
          Topic <span>(선택)</span>
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
            {busy ? "찾는 중…" : "AI로 찾아서 추가"}
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
          <h3>추가 기록</h3>
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
                  <p className={styles.empty}>새 항목 없음</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
