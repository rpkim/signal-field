"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import colors from "@/data/colors.json";
import density from "@/data/density.json";
import presets from "@/data/presets.json";
import references from "@/data/references.json";
import baseResearch from "@/data/research.json";
import baseTrends from "@/data/trends.json";
import typeData from "@/data/type.json";
import type { SyncSuggestion } from "@/lib/discover/syncPropose";
import { applySuggestions } from "@/lib/discover/syncPropose";
import type { TrendCandidate } from "@/lib/discover/types";
import { downloadBlob } from "@/lib/exportKit";
import type { ColorItem, DensityItem, MixState, TypeItem } from "@/lib/types";
import { Button } from "./Button";
import { Specimen } from "./Specimen";
import styles from "./ComposeClient.module.css";

const colorItems = colors.items as ColorItem[];
const typeItems = typeData.items as TypeItem[];
const densityItems = density.items as DensityItem[];

type ResearchItem = {
  id: string;
  title: string;
  implications?: string[];
};

type TrendItem = TrendCandidate;

const DEFAULT: MixState = {
  research: ["wcag-22", "m3-roles"],
  references: ["ibm-lang"],
  color: "signal-teal",
  type: "plex",
  density: "default",
  trends: [],
};

function byId<T extends { id: string }>(list: T[], id: string) {
  return list.find((x) => x.id === id) ?? list[0];
}

export function ComposeClient() {
  const params = useSearchParams();
  const [mix, setMix] = useState<MixState>(DEFAULT);
  const [presetId, setPresetId] = useState<string | null>("precise-quiet");
  const [saveName, setSaveName] = useState("");
  const [status, setStatus] = useState("");
  const [researchItems, setResearchItems] = useState<ResearchItem[]>(
    baseResearch.items as ResearchItem[]
  );
  const [trendItems, setTrendItems] = useState<TrendItem[]>(
    baseTrends.items as TrendItem[]
  );
  const [additionResearchIds, setAdditionResearchIds] = useState<string[]>([]);
  const [additionTrendIds, setAdditionTrendIds] = useState<string[]>([]);
  const [syncOpen, setSyncOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SyncSuggestion[]>([]);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [resR, resT] = await Promise.all([
        fetch("/api/catalog?axis=research").then((r) => r.json()),
        fetch("/api/catalog?axis=trends").then((r) => r.json()),
      ]);
      if (cancelled) return;
      if (resR?.items) {
        setResearchItems(resR.items);
        const baseIds = new Set(baseResearch.items.map((i) => i.id));
        setAdditionResearchIds(
          resR.items
            .filter((i: ResearchItem) => !baseIds.has(i.id))
            .map((i: ResearchItem) => i.id)
        );
      }
      if (resT?.items) {
        setTrendItems(resT.items);
        const baseIds = new Set(baseTrends.items.map((i) => i.id));
        setAdditionTrendIds(
          resT.items
            .filter((i: TrendItem) => !baseIds.has(i.id))
            .map((i: TrendItem) => i.id)
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next: MixState = { ...DEFAULT, trends: [] };
      const saveId = params.get("save");
      if (saveId) {
        const saved = await fetch(`/api/saved-mixes?id=${encodeURIComponent(saveId)}`).then(
          (r) => (r.ok ? r.json() : null)
        );
        if (cancelled) return;
        if (saved?.mix) {
          setMix({
            ...DEFAULT,
            ...saved.mix,
            trends: saved.mix.trends || [],
          });
          setPresetId(null);
          setSaveName(saved.name || "");
          setStatus(`Loaded save: ${saved.name}`);
          return;
        }
      }
      const preset = params.get("preset");
      if (preset) {
        const found = presets.items.find((p) => p.id === preset);
        if (found) {
          Object.assign(next, found.mix);
          setPresetId(found.id);
        }
      }
      const color = params.get("color");
      const type = params.get("type");
      const dens = params.get("density");
      const res = params.get("research");
      const refs = params.get("references");
      const trends = params.get("trends");
      if (color) next.color = color;
      if (type) next.type = type;
      if (dens) next.density = dens;
      if (res) next.research = res.split(",").filter(Boolean);
      if (refs) next.references = refs.split(",").filter(Boolean);
      if (trends) next.trends = trends.split(",").filter(Boolean);
      if (!cancelled) setMix(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [params]);

  const color = byId(colorItems, mix.color);
  const type = byId(typeItems, mix.type);
  const dens = byId(densityItems, mix.density);

  const newCount =
    additionResearchIds.filter((id) => !mix.research.includes(id)).length +
    additionTrendIds.filter((id) => !(mix.trends || []).includes(id)).length;

  const specimenStyle = useMemo(() => {
    const roles = { ...color.roles, ...dens.tokens } as Record<string, string>;
    return {
      ...roles,
      ["--font-display" as string]: `"${type.display}", ${type.fallbacks}`,
      ["--font-body" as string]: `"${type.body}", ${type.fallbacks}`,
      ["--tracking-display" as string]: type.trackingDisplay,
      background: roles["--color-field"],
      color: roles["--color-ink"],
    } as React.CSSProperties;
  }, [color, dens, type]);

  function toggleMulti(
    axis: "research" | "references" | "trends",
    id: string,
    max: number
  ) {
    setPresetId(null);
    setMix((prev) => {
      const arr = [...(prev[axis] || [])];
      const i = arr.indexOf(id);
      if (i >= 0) arr.splice(i, 1);
      else {
        if (arr.length >= max) arr.shift();
        arr.push(id);
      }
      return { ...prev, [axis]: arr };
    });
  }

  function setOne(axis: "color" | "type" | "density", id: string) {
    setPresetId(null);
    setMix((prev) => ({ ...prev, [axis]: id }));
  }

  function applyPreset(id: string) {
    const found = presets.items.find((p) => p.id === id);
    if (!found) return;
    setPresetId(id);
    setMix({ ...found.mix, trends: [] });
  }

  async function exportKit() {
    setBusy(true);
    try {
      const res = await fetch("/api/export-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: saveName || `${mix.color}-${mix.type}`,
          mix,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Export failed");
      }
      const blob = await res.blob();
      const disp = res.headers.get("Content-Disposition") || "";
      const match = disp.match(/filename="([^"]+)"/);
      downloadBlob(match?.[1] || "signal-field-kit.zip", blob);
      setStatus(
        "Downloaded zip: design.md + tokens.css + theme.css (+ DESIGN.md, mix.json)"
      );
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Export failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveCurrent() {
    setBusy(true);
    try {
      const res = await fetch("/api/saved-mixes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: saveName || `${mix.color} · ${mix.type}`,
          mix,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setStatus(`Saved “${data.name}” — load from Doc`);
      setSaveName(data.name);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function openSync() {
    setBusy(true);
    setSyncOpen(true);
    try {
      const res = await fetch("/api/discover/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mix }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");
      setSuggestions(data.suggestions || []);
      setPicked(
        Object.fromEntries(
          (data.suggestions || []).map((s: SyncSuggestion) => [s.id, true])
        )
      );
      setStatus(data.note || "");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setBusy(false);
    }
  }

  function confirmSync() {
    const accepted = suggestions.filter((s) => picked[s.id]);
    if (!accepted.length) {
      setStatus("Nothing selected — mix unchanged.");
      setSyncOpen(false);
      return;
    }
    setMix(applySuggestions(mix, accepted));
    setPresetId(null);
    setSyncOpen(false);
    setStatus(`Applied ${accepted.length} update(s) to the mix.`);
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.saveField}>
          <label htmlFor="save-name">Save mix</label>
          <input
            id="save-name"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Name this mix"
          />
        </div>
        <Button type="button" disabled={busy} onClick={saveCurrent}>
          Save
        </Button>
        <Button type="button" variant="ghost" disabled={busy} onClick={exportKit}>
          Download kit (zip)
        </Button>
      </div>

      {newCount > 0 ? (
        <div className={styles.banner}>
          <p>
            Trends/Research catalogs have {newCount} item(s) not in this mix.
            Sync proposes adds/replaces — nothing changes until you confirm.
          </p>
          <Button type="button" disabled={busy} onClick={openSync}>
            업데이트 반영
          </Button>
        </div>
      ) : null}

      {syncOpen ? (
        <div className={styles.syncList}>
          {suggestions.length === 0 ? (
            <p className={styles.status}>No suggestions for the current mix.</p>
          ) : (
            suggestions.map((s) => (
              <label key={s.id} className={styles.syncItem}>
                <strong>
                  <input
                    type="checkbox"
                    checked={!!picked[s.id]}
                    onChange={(e) =>
                      setPicked((prev) => ({ ...prev, [s.id]: e.target.checked }))
                    }
                  />{" "}
                  {s.kind}: {s.label}
                </strong>
                <p>{s.reason}</p>
              </label>
            ))
          )}
          <div className={styles.syncActions}>
            <Button type="button" onClick={confirmSync}>
              Confirm selected
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSyncOpen(false);
                setStatus("Sync dismissed — mix unchanged.");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      {status ? <p className={styles.status}>{status}</p> : null}

      <div className={styles.presets} role="group" aria-label="Presets">
        {presets.items.map((p) => (
          <button
            key={p.id}
            type="button"
            className={styles.preset}
            aria-pressed={presetId === p.id}
            onClick={() => applyPreset(p.id)}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        <div>
          <Axis
            title={`${baseResearch.label}`}
            hint={`Select up to ${baseResearch.max}`}
          >
            <div className={styles.optGrid}>
              {researchItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.chip}
                  aria-pressed={mix.research.includes(item.id)}
                  onClick={() =>
                    toggleMulti("research", item.id, baseResearch.max)
                  }
                >
                  <strong>
                    {item.title}
                    {additionResearchIds.includes(item.id) ? (
                      <span className={styles.badgeNew}>new</span>
                    ) : null}
                  </strong>
                  <span className={styles.meta}>
                    {item.implications?.[0] ?? ""}
                  </span>
                </button>
              ))}
            </div>
          </Axis>

          <Axis title="Trends" hint="Select up to 3 (optional context)">
            <div className={styles.optGrid}>
              {trendItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.chip}
                  aria-pressed={(mix.trends || []).includes(item.id)}
                  onClick={() => toggleMulti("trends", item.id, 3)}
                >
                  <strong>
                    {item.en}
                    {additionTrendIds.includes(item.id) ? (
                      <span className={styles.badgeNew}>new</span>
                    ) : null}
                  </strong>
                  <span className={styles.meta}>{item.what}</span>
                </button>
              ))}
            </div>
          </Axis>

          <Axis title={references.label} hint={`Select up to ${references.max}`}>
            <div className={styles.optGrid}>
              {references.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.chip}
                  aria-pressed={mix.references.includes(item.id)}
                  onClick={() =>
                    toggleMulti("references", item.id, references.max)
                  }
                >
                  <strong>{item.title}</strong>
                  <span className={styles.meta}>{item.steal}</span>
                </button>
              ))}
            </div>
          </Axis>

          <Axis
            title={`${colors.label} (${colorItems.length})`}
            hint="Select one"
          >
            <div className={styles.colorGrid}>
              {colorItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.chip}
                  aria-pressed={mix.color === item.id}
                  onClick={() => setOne("color", item.id)}
                >
                  {item.swatches ? (
                    <span className={styles.swRow}>
                      {item.swatches.map((hex) => (
                        <i key={hex} style={{ background: hex }} />
                      ))}
                    </span>
                  ) : null}
                  <span>
                    <strong>
                      {item.name}
                      {item.ko ? (
                        <span className={styles.ko}>{item.ko}</span>
                      ) : null}
                    </strong>
                    <span className={styles.meta}>
                      {item.when || item.feeling}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </Axis>

          <Axis title={typeData.label} hint="Select one">
            <div className={styles.optGrid}>
              {typeItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.chip}
                  aria-pressed={mix.type === item.id}
                  onClick={() => setOne("type", item.id)}
                >
                  <strong>{item.name}</strong>
                  <span className={styles.meta}>{item.rationale}</span>
                </button>
              ))}
            </div>
          </Axis>

          <Axis title={density.label} hint="Select one">
            <div className={styles.optGrid}>
              {densityItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.chip}
                  aria-pressed={mix.density === item.id}
                  onClick={() => setOne("density", item.id)}
                >
                  <strong>
                    {item.name}
                    {item.ko ? (
                      <span className={styles.ko}>{item.ko}</span>
                    ) : null}
                  </strong>
                </button>
              ))}
            </div>
          </Axis>
        </div>

        <aside className={styles.side}>
          <Specimen
            style={specimenStyle}
            title="Live mix"
            meta={`${mix.color} · ${mix.type} · ${mix.density}${(mix.trends || []).length ? ` · ${mix.trends!.length} trends` : ""}`}
            swatches={color.swatches}
          />
          <div className={styles.exportRow}>
            <Button type="button" disabled={busy} onClick={exportKit}>
              Download kit (zip)
            </Button>
          </div>
          <p className={styles.status}>
            One click → <code>design.md</code> + <code>tokens.css</code> +{" "}
            <code>theme.css</code> (plus kit DESIGN.md / mix.json).
          </p>
        </aside>
      </div>
    </div>
  );
}

function Axis({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.axis}>
      <h3>{title}</h3>
      <p className={styles.hint}>{hint}</p>
      {children}
    </section>
  );
}
