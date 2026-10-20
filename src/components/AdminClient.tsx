"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "./Button";
import references from "@/data/references.json";
import type {
  DiscoverAxis,
  ResearchCandidate,
  TrendCandidate,
} from "@/lib/discover/types";
import styles from "./AdminClient.module.css";

type Stored = (TrendCandidate | ResearchCandidate) & { origin?: string };

type Catalog = {
  trends: {
    items: Stored[];
    categories: Array<{ id: string; en: string; ko: string }>;
  };
  research: {
    items: Stored[];
  };
};

type Proposal = {
  mode?: string;
  provider?: string;
  note?: string;
  candidates: Array<TrendCandidate | ResearchCandidate>;
};

function isTrend(item: TrendCandidate | ResearchCandidate): item is TrendCandidate {
  return "en" in item;
}

function labelOf(item: TrendCandidate | ResearchCandidate) {
  return isTrend(item) ? item.en : item.title;
}

function summaryOf(item: TrendCandidate | ResearchCandidate) {
  return isTrend(item) ? item.what : item.implications[0] || "";
}

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

function resourcesOf(item: TrendCandidate | ResearchCandidate) {
  const hrefs = isTrend(item)
    ? [
        ...(item.sources || []),
        ...item.refs.flatMap((id) => {
          const ref = referenceLinks.get(id);
          return ref ? [ref.href] : [];
        }),
      ]
    : [item.source, ...(item.sources || [])];
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

function resourceText(item: TrendCandidate | ResearchCandidate) {
  if (isTrend(item)) return (item.sources || []).join("\n");
  const urls = [item.source, ...(item.sources || [])].map((href) => href.trim()).filter(Boolean);
  return [...new Set(urls)].join("\n");
}

function withResources(
  item: TrendCandidate | ResearchCandidate,
  text: string
): TrendCandidate | ResearchCandidate {
  const urls = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (isTrend(item)) return { ...item, sources: urls };
  return { ...item, source: urls[0] || "", sources: urls };
}

const emptyTrend = (): TrendCandidate => ({
  id: "",
  category: "platform",
  en: "",
  ko: "",
  what: "",
  when: "",
  skip: "",
  research: [],
  refs: [],
  logDate: new Date().toISOString().slice(0, 10),
});

const emptyResearch = (): ResearchCandidate => ({
  id: "",
  title: "",
  year: new Date().getFullYear(),
  source: "",
  implications: [],
});

export function AdminClient() {
  const [axis, setAxis] = useState<DiscoverAxis>("trends");
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [topic, setTopic] = useState("");
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<TrendCandidate | ResearchCandidate | null>(null);
  const [creating, setCreating] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/catalog", { cache: "no-store" });
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    if (!res.ok) throw new Error("Catalog failed to load");
    setAuthed(true);
    setCatalog((await res.json()) as Catalog);
  }, []);

  useEffect(() => {
    load().catch((err: unknown) =>
      setStatus(err instanceof Error ? err.message : "Catalog failed to load")
    );
  }, [load]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Login failed");
      setPassword("");
      await load();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  const items = (catalog?.[axis].items ?? []) as Stored[];
  const additions = items.filter((item) => item.origin !== "seed");
  const base = items.filter((item) => item.origin === "seed");
  const known = new Set(items.map((item) => item.id));

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    setProposal(null);
    try {
      const res = await fetch("/api/discover/propose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ axis, topic }),
      });
      const data = (await res.json()) as Proposal & { error?: string };
      if (!res.ok) throw new Error(data.error || "Search failed");
      setProposal({
        mode: data.mode,
        provider: data.provider,
        note: data.note,
        candidates: data.candidates || [],
      });
      if (!data.candidates?.length) setStatus("Nothing new to review.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Search failed");
    } finally {
      setBusy(false);
    }
  }

  async function save(action: "create" | "update", item: TrendCandidate | ResearchCandidate) {
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ axis, action, item }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Save failed");
      setProposal((prev) =>
        prev
          ? {
              ...prev,
              candidates: prev.candidates.filter((candidate) => candidate.id !== item.id),
            }
          : prev
      );
      setEditing(null);
      setDraft(null);
      setCreating(false);
      setStatus(action === "create" ? "Added." : "Saved.");
      await load();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ axis, action: "delete", id }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Remove failed");
      setStatus("Removed.");
      await load();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Remove failed");
    } finally {
      setBusy(false);
    }
  }

  const categories = catalog?.trends.categories ?? [];

  if (authed !== true) {
    return (
      <form className={styles.search} onSubmit={login}>
        <label className={styles.field}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={busy || authed === null}
          />
        </label>
        <div className={styles.row}>
          <Button type="submit" disabled={busy || authed === null || !password}>
            {authed === null ? "Checking…" : "Unlock"}
          </Button>
        </div>
        <p className={styles.note}>Uses the ADMIN_PASSWORD environment variable.</p>
        {status ? (
          <p className={styles.status} role="status">
            {status}
          </p>
        ) : null}
      </form>
    );
  }

  return (
    <div>
      <div className={styles.tabs} role="tablist" aria-label="Catalog">
        {(["trends", "research"] as const).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-pressed={axis === id}
            onClick={() => {
              setAxis(id);
              setProposal(null);
              setEditing(null);
              setCreating(false);
              setDraft(null);
            }}
          >
            {id === "trends" ? "Trends" : "Research"}
          </button>
        ))}
      </div>

      <form className={styles.search} onSubmit={search}>
        <label className={styles.field}>
          Topic
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={
              axis === "trends" ? "quiet commerce, fluid type…" : "WCAG focus appearance…"
            }
            disabled={busy}
          />
        </label>
        <div className={styles.row}>
          <Button type="submit" disabled={busy}>
            {busy ? "Searching…" : "Find"}
          </Button>
        </div>
        <p className={styles.note}>
          A search only lists drafts. Nothing is saved until you choose Add.
        </p>
      </form>

      {status ? (
        <p className={styles.status} role="status">
          {status}
        </p>
      ) : null}

      {proposal ? (
        <section>
          <h2 className={styles.heading}>Review</h2>
          {proposal.mode === "offline" ? (
            <p className={styles.note}>
              Gemini is not configured, so these are drafts from the topic — not a live search.
              {proposal.note ? ` ${proposal.note}` : ""}
            </p>
          ) : (
            <p className={styles.note}>
              Drafts from {proposal.provider || "AI"}. Nothing is saved until you choose Add.
            </p>
          )}
          <ul className={styles.list}>
            {proposal.candidates.map((item) => {
              const exists = known.has(item.id);
              return (
                <li key={item.id} className={styles.item}>
                  <div>
                    <h3>{labelOf(item)}</h3>
                    <p className={styles.meta}>
                  {isTrend(item) && item.logDate ? `${item.logDate} · ` : ""}
                  {summaryOf(item)}
                </p>
                    <ResourceLinks item={item} />
                  </div>
                  <div className={styles.row}>
                    <Button
                      type="button"
                      disabled={busy || exists}
                      onClick={() => save("create", item)}
                    >
                      {exists ? "Already in the catalog" : "Add"}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className={styles.manual}>
        <h2 className={styles.heading}>Added by you</h2>
        {!creating ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setCreating(true);
              setEditing(null);
              setDraft(axis === "trends" ? emptyTrend() : emptyResearch());
            }}
          >
            Add by hand
          </Button>
        ) : draft ? (
          <ItemForm
            axis={axis}
            categories={categories}
            draft={draft}
            busy={busy}
            onChange={setDraft}
            onCancel={() => {
              setCreating(false);
              setDraft(null);
            }}
            onSave={() => save("create", draft)}
          />
        ) : null}
        <ul className={styles.list}>
          {additions.map((item) => (
            <li key={item.id} className={styles.item}>
              <div>
                <h3>
                  <span className={styles.badge}>Added</span>
                  {labelOf(item)}
                </h3>
                <p className={styles.meta}>
                  {isTrend(item) && item.logDate ? `${item.logDate} · ` : ""}
                  {summaryOf(item)}
                </p>
                <ResourceLinks item={item} />
              </div>
              {editing === item.id && draft ? (
                <ItemForm
                  axis={axis}
                  categories={categories}
                  draft={draft}
                  busy={busy}
                  onChange={setDraft}
                  onCancel={() => {
                    setEditing(null);
                    setDraft(null);
                  }}
                  onSave={() => save("update", { ...draft, id: item.id })}
                />
              ) : (
                <div className={styles.row}>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setCreating(false);
                      setEditing(item.id);
                      setDraft(item);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    disabled={busy}
                    onClick={() => remove(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className={styles.heading}>Built-in</h2>
        <ul className={styles.list}>
          {base.map((item) => (
            <li key={item.id} className={styles.item}>
              <div>
                <h3>
                  <span className={styles.badge}>Built-in</span>
                  {labelOf(item)}
                </h3>
                <p className={styles.meta}>
                  {isTrend(item) && item.logDate ? `${item.logDate} · ` : ""}
                  {summaryOf(item)}
                </p>
                <ResourceLinks item={item} />
              </div>
              {editing === item.id && draft ? (
                <ItemForm
                  axis={axis}
                  categories={categories}
                  draft={draft}
                  busy={busy}
                  onChange={setDraft}
                  onCancel={() => {
                    setEditing(null);
                    setDraft(null);
                  }}
                  onSave={() => save("update", { ...draft, id: item.id })}
                />
              ) : (
                <div className={styles.row}>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setCreating(false);
                      setEditing(item.id);
                      setDraft(item);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    disabled={busy}
                    onClick={() => remove(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ResourceLinks({ item }: { item: TrendCandidate | ResearchCandidate }) {
  const links = resourcesOf(item);
  if (!links.length) return null;
  return (
    <ul className={styles.links}>
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function ItemForm({
  axis,
  categories,
  draft,
  busy,
  onChange,
  onCancel,
  onSave,
}: {
  axis: DiscoverAxis;
  categories: Array<{ id: string; en: string }>;
  draft: TrendCandidate | ResearchCandidate;
  busy: boolean;
  onChange: (next: TrendCandidate | ResearchCandidate) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  if (axis === "trends" && isTrend(draft)) {
    return (
      <div className={styles.editor}>
        <label className={styles.field}>
          Name
          <input
            value={draft.en}
            onChange={(e) => onChange({ ...draft, en: e.target.value })}
          />
        </label>
        <label className={styles.field}>
          Korean
          <input
            value={draft.ko}
            onChange={(e) => onChange({ ...draft, ko: e.target.value })}
          />
        </label>
        <label className={styles.field}>
          Category
          <select
            value={draft.category}
            onChange={(e) => onChange({ ...draft, category: e.target.value })}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.en}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          What
          <textarea
            value={draft.what}
            onChange={(e) => onChange({ ...draft, what: e.target.value })}
          />
        </label>
        <label className={styles.field}>
          Resources
          <textarea
            value={resourceText(draft)}
            onChange={(e) => onChange(withResources(draft, e.target.value))}
            placeholder="One https URL per line"
          />
        </label>
        <div className={styles.row}>
          <Button type="button" disabled={busy || !draft.en.trim()} onClick={onSave}>
            Save
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  const research = draft as ResearchCandidate;
  return (
    <div className={styles.editor}>
      <label className={styles.field}>
        Title
        <input
          value={research.title}
          onChange={(e) => onChange({ ...research, title: e.target.value })}
        />
      </label>
      <label className={styles.field}>
        Resources
        <textarea
          value={resourceText(research)}
          onChange={(e) => onChange(withResources(research, e.target.value))}
          placeholder="One https URL per line"
        />
      </label>
      <label className={styles.field}>
        Implications
        <textarea
          value={research.implications.join("\n")}
          onChange={(e) =>
            onChange({
              ...research,
              implications: e.target.value.split("\n").map((line) => line.trim()).filter(Boolean),
            })
          }
        />
      </label>
      <div className={styles.row}>
        <Button type="button" disabled={busy || !research.title.trim()} onClick={onSave}>
          Save
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
