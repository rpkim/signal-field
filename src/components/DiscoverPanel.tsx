"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./Button";
import styles from "./DiscoverPanel.module.css";
import type {
  DiscoverAxis,
  ProposeResult,
  ResearchCandidate,
  TrendCandidate,
} from "@/lib/discover/types";

type Props = {
  axis: DiscoverAxis;
};

type LocalState = "pending" | "accepted" | "rejected";

export function DiscoverPanel({ axis }: Props) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<ProposeResult | null>(null);
  const [local, setLocal] = useState<Record<string, LocalState>>({});

  async function propose(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setStatus("검색·구조화 중…");
    setResult(null);
    setLocal({});
    try {
      const res = await fetch("/api/discover/propose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ axis, topic, notes }),
      });
      const data = (await res.json()) as ProposeResult & { error?: string };
      if (!res.ok) throw new Error(data.error || "Propose failed");
      setResult(data);
      setStatus(
        data.note ||
          (data.mode === "ai"
            ? `AI propose (${data.provider || "model"}) — Accept로 카탈로그에 추가`
            : "Offline propose — Accept로 카탈로그에 추가")
      );
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Propose failed");
    } finally {
      setBusy(false);
    }
  }

  async function accept(item: TrendCandidate | ResearchCandidate) {
    setBusy(true);
    try {
      const res = await fetch("/api/discover/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ axis, item }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Accept failed");
      setLocal((prev) => ({ ...prev, [item.id]: "accepted" }));
      setStatus(`추가됨: ${item.id}`);
      router.refresh();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Accept failed");
    } finally {
      setBusy(false);
    }
  }

  function reject(id: string) {
    setLocal((prev) => ({ ...prev, [id]: "rejected" }));
  }

  return (
    <section className={styles.panel} aria-labelledby="discover-heading">
      <h2 id="discover-heading" className="sr-only">
        Discover
      </h2>
      <p className={styles.intro}>
        AI로 검색해 추가 — topic을 비우면 현재 product/UI craft를 기준으로
        제안합니다. API 키가 없으면 URL·노트를 같은 스키마로 구조화합니다.
      </p>
      <form className={styles.form} onSubmit={propose}>
        <label htmlFor={`discover-topic-${axis}`}>
          Topic
          <input
            id={`discover-topic-${axis}`}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="예: liquid glass deference, fluid type, quiet commerce"
          />
        </label>
        <label htmlFor={`discover-notes-${axis}`}>
          Notes / URLs
          <textarea
            id={`discover-notes-${axis}`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="출처 URL이나 메모를 붙여넣기 (offline fallback에 사용)"
            spellCheck={false}
          />
        </label>
        <div className={styles.actions}>
          <Button type="submit" disabled={busy}>
            AI로 검색해 추가
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={busy}
            onClick={async () => {
              setTopic("");
              setBusy(true);
              setStatus("검색·구조화 중…");
              setResult(null);
              setLocal({});
              try {
                const res = await fetch("/api/discover/propose", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ axis, topic: "", notes }),
                });
                const data = (await res.json()) as ProposeResult & {
                  error?: string;
                };
                if (!res.ok) throw new Error(data.error || "Propose failed");
                setResult(data);
                setStatus(
                  data.note ||
                    (data.mode === "ai"
                      ? `AI propose (${data.provider || "model"})`
                      : "Offline propose")
                );
              } catch (err) {
                setStatus(err instanceof Error ? err.message : "Propose failed");
              } finally {
                setBusy(false);
              }
            }}
          >
            What&apos;s current
          </Button>
        </div>
      </form>
      {status ? <p className={styles.status}>{status}</p> : null}

      {result?.candidates?.length ? (
        <div className={styles.candidates}>
          {result.candidates.map((item) => {
            const state = local[item.id] || "pending";
            const isTrend = "en" in item;
            return (
              <article key={item.id} className={styles.candidate}>
                <p className={styles.meta}>
                  {isTrend
                    ? `${(item as TrendCandidate).category} · ${(item as TrendCandidate).logDate}`
                    : `${(item as ResearchCandidate).year}`}
                  {state !== "pending" ? ` · ${state}` : ""}
                </p>
                <h3>
                  {isTrend
                    ? `${(item as TrendCandidate).en}${(item as TrendCandidate).ko ? ` · ${(item as TrendCandidate).ko}` : ""}`
                    : (item as ResearchCandidate).title}
                </h3>
                {isTrend ? (
                  <>
                    <p className={styles.body}>{(item as TrendCandidate).what}</p>
                    <p className={styles.body}>
                      When: {(item as TrendCandidate).when} — Skip:{" "}
                      {(item as TrendCandidate).skip}
                    </p>
                  </>
                ) : (
                  <ul className={styles.implications}>
                    {(item as ResearchCandidate).implications.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
                {state === "pending" ? (
                  <div className={styles.row}>
                    <Button
                      type="button"
                      disabled={busy}
                      onClick={() => accept(item)}
                    >
                      Accept
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={busy}
                      onClick={() => reject(item.id)}
                    >
                      Reject
                    </Button>
                  </div>
                ) : state === "accepted" ? (
                  <p className={styles.accepted}>Catalog에 추가됨</p>
                ) : (
                  <p className={styles.rejected}>Skipped</p>
                )}
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
