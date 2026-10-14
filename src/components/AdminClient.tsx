"use client";

import { useCallback, useEffect, useState } from "react";
import { DiscoverPanel } from "./DiscoverPanel";
import { Button } from "./Button";
import styles from "./AdminClient.module.css";

type ResearchRow = {
  id: string;
  title: string;
  origin: string;
};
type TrendRow = {
  id: string;
  en: string;
  ko: string;
  origin: string;
};

export function AdminClient({ initiallyAuthed }: { initiallyAuthed: boolean }) {
  const [authed, setAuthed] = useState(initiallyAuthed);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"trends" | "research">("trends");
  const [research, setResearch] = useState<ResearchRow[]>([]);
  const [trends, setTrends] = useState<TrendRow[]>([]);
  const [status, setStatus] = useState("");

  const loadItems = useCallback(async () => {
    const res = await fetch("/api/admin/items");
    if (!res.ok) {
      if (res.status === 401) setAuthed(false);
      return;
    }
    const data = (await res.json()) as {
      research: ResearchRow[];
      trends: TrendRow[];
    };
    setResearch(data.research || []);
    setTrends(data.trends || []);
  }, []);

  useEffect(() => {
    if (authed) void loadItems();
  }, [authed, loadItems]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Login failed");
      setAuthed(true);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
  }

  async function removeItem(axis: "research" | "trends", id: string) {
    setStatus("");
    const res = await fetch("/api/admin/items", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ axis, id }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setStatus(data.error || "Delete failed");
      return;
    }
    setStatus(`Deleted ${id}`);
    await loadItems();
  }

  if (!authed) {
    return (
      <section className={styles.login}>
        <h1 className={styles.title}>Admin</h1>
        <p className={styles.lede}>
          Sign in to manage AI additions for Trends and Research (local SQLite).
        </p>
        <form className={styles.form} onSubmit={login}>
          <label htmlFor="admin-pass">
            Password
            <input
              id="admin-pass"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
            />
          </label>
          <Button type="submit" disabled={busy || !password}>
            {busy ? "…" : "Enter"}
          </Button>
          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </section>
    );
  }

  const aiResearch = research.filter((r) => r.origin === "ai");
  const aiTrends = trends.filter((t) => t.origin === "ai");

  return (
    <div className={styles.root}>
      <header className={styles.top}>
        <div>
          <h1 className={styles.title}>Admin</h1>
          <p className={styles.lede}>
            Local DB · AI discover for Trends / Research. Public pages stay
            read-only.
          </p>
        </div>
        <Button type="button" variant="ghost" onClick={() => void logout()}>
          Log out
        </Button>
      </header>

      <div className={styles.tabs} role="tablist" aria-label="Admin axis">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "trends"}
          onClick={() => setTab("trends")}
        >
          Trends
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "research"}
          onClick={() => setTab("research")}
        >
          Research
        </button>
      </div>

      <DiscoverPanel
        key={tab}
        axis={tab}
        onAdded={() => {
          void loadItems();
        }}
      />

      <section className={styles.manage}>
        <h2>AI-added items</h2>
        <p className={styles.hint}>
          Seeded catalog rows are locked. Only AI additions can be removed.
        </p>
        {status ? (
          <p className={styles.status} role="status">
            {status}
          </p>
        ) : null}
        {tab === "trends" ? (
          <ul className={styles.list}>
            {aiTrends.length === 0 ? (
              <li className={styles.empty}>No AI trend additions yet.</li>
            ) : (
              aiTrends.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>
                      {item.en}
                      {item.ko ? ` · ${item.ko}` : ""}
                    </strong>
                    <code>{item.id}</code>
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => void removeItem("trends", item.id)}
                  >
                    Remove
                  </Button>
                </li>
              ))
            )}
          </ul>
        ) : (
          <ul className={styles.list}>
            {aiResearch.length === 0 ? (
              <li className={styles.empty}>No AI research additions yet.</li>
            ) : (
              aiResearch.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <code>{item.id}</code>
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => void removeItem("research", item.id)}
                  >
                    Remove
                  </Button>
                </li>
              ))
            )}
          </ul>
        )}
        <p className={styles.meta}>
          Catalog totals — research {research.length} · trends {trends.length}{" "}
          (stored in <code>data/signal-field.sqlite</code>).
        </p>
      </section>
    </div>
  );
}
