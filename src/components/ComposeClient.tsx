"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
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
import {
  mergeMixTokens,
  researchSurfaceMode,
  type ReferenceLike,
  type ResearchLike,
  type TrendLike,
} from "@/lib/mergeMixTokens";
import type { ColorItem, DensityItem, MixState, TypeItem } from "@/lib/types";
import { useLocale } from "@/i18n/LocaleProvider";
import { Button } from "./Button";
import { Specimen } from "./Specimen";
import styles from "./ComposeClient.module.css";

const colorItems = colors.items as ColorItem[];
const typeItems = typeData.items as TypeItem[];
const densityItems = density.items as unknown as DensityItem[];
const recommendedTypeId =
  (typeData as { recommended?: string; default?: string }).recommended ||
  (typeData as { default?: string }).default ||
  typeItems.find((item) => item.recommended)?.id ||
  "plex";

type ResearchItem = ResearchLike & {
  title: string;
  year?: number;
  implications?: string[];
};

type TrendItem = TrendCandidate & TrendLike;

const DEFAULT: MixState = {
  research: ["wcag-22", "m3-roles"],
  references: ["ibm-lang"],
  color: "signal-teal",
  type: recommendedTypeId,
  density: "default",
  trends: [],
};

function byId<T extends { id: string }>(list: T[], id: string) {
  return list.find((x) => x.id === id) ?? list[0];
}

function suggestedFields(ids: string[], items: TrendItem[]) {
  const patch: Partial<Pick<MixState, "color" | "type" | "density">> = {};
  for (const id of ids) {
    const suggestion = items.find((item) => item.id === id)?.suggestMix;
    if (!suggestion) continue;
    if (suggestion.color && colorItems.some((item) => item.id === suggestion.color)) {
      patch.color = suggestion.color;
    }
    if (suggestion.type && typeItems.some((item) => item.id === suggestion.type)) {
      patch.type = suggestion.type;
    }
    if (suggestion.density && densityItems.some((item) => item.id === suggestion.density)) {
      patch.density = suggestion.density;
    }
  }
  return patch;
}

export function ComposeClient() {
  const { t, locale } = useLocale();
  const params = useSearchParams();
  const [mix, setMix] = useState<MixState>(DEFAULT);
  const [presetId, setPresetId] = useState<string | null>("precise-quiet");
  const [saveName, setSaveName] = useState("");
  const [status, setStatus] = useState("");
  const [researchItems, setResearchItems] = useState<ResearchItem[]>(
    baseResearch.items as unknown as ResearchItem[]
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
  const mixRef = useRef(mix);
  mixRef.current = mix;

  function updateMix(updater: (prev: MixState) => MixState) {
    const prev = mixRef.current;
    const next = updater(prev);
    const motion =
      (next.trends || []).includes("restrained-view-transitions") ||
      (prev.trends || []).includes("restrained-view-transitions");
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (motion && !reduced && typeof document !== "undefined" && document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          mixRef.current = next;
          setMix(next);
        });
      });
      return;
    }
    mixRef.current = next;
    setMix(next);
  }

  useEffect(() => {
    let cancelled = false;
    async function loadCatalogs() {
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
    }
    loadCatalogs();
    const onFocus = () => {
      void loadCatalogs();
    };
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
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
      if (trends) {
        next.trends = trends.split(",").filter(Boolean);
        const patch = suggestedFields(next.trends, baseTrends.items as TrendItem[]);
        if (!color && patch.color) next.color = patch.color;
        if (!type && patch.type) next.type = patch.type;
        if (!dens && patch.density) next.density = patch.density;
      }
      if (!cancelled) {
        setMix(next);
        if (color || type || dens || res || refs || trends || !preset) {
          if (!preset) setPresetId(null);
        }
      }
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

  const mixTokens = useMemo(
    () =>
      mergeMixTokens({
        mix,
        color,
        type,
        density: dens,
        researchItems,
        referenceItems: references.items as ReferenceLike[],
        trendItems,
      }),
    [mix, color, type, dens, researchItems, trendItems]
  );

  const surfaceMode = researchSurfaceMode(mix.research);

  const specimenStyle = useMemo(() => {
    return {
      ...mixTokens,
      color: mixTokens["--color-ink"],
    } as React.CSSProperties;
  }, [mixTokens]);

  // Live-apply mix to the document (same idea as legacy compose.js) so research
  // pillars like Liquid Glass change real chrome, not only the specimen card.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const previous = new Map<string, string>();
    for (const [key, value] of Object.entries(mixTokens)) {
      if (!key.startsWith("--")) continue;
      previous.set(key, root.style.getPropertyValue(key));
      root.style.setProperty(key, value);
    }
    const prevMix = root.dataset.composeMix;
    const prevSurface = root.dataset.surface;
    const prevResearch = root.dataset.research;
    root.dataset.composeMix = "1";
    root.dataset.surface = surfaceMode;
    root.dataset.research = mix.research.join(" ");
    const prevMotion = root.dataset.motion;
    if (mixTokens["--motion-policy"]) root.dataset.motion = mixTokens["--motion-policy"];
    else delete root.dataset.motion;
    return () => {
      for (const [key, value] of previous) {
        if (value) root.style.setProperty(key, value);
        else root.style.removeProperty(key);
      }
      if (prevMix === undefined) delete root.dataset.composeMix;
      else root.dataset.composeMix = prevMix;
      if (prevSurface === undefined) delete root.dataset.surface;
      else root.dataset.surface = prevSurface;
      if (prevResearch === undefined) delete root.dataset.research;
      else root.dataset.research = prevResearch;
      if (prevMotion === undefined) delete root.dataset.motion;
      else root.dataset.motion = prevMotion;
    };
  }, [mixTokens, mix.research, surfaceMode]);

  // Load Google Fonts only for the selected type option (Compose specimen preview).
  useEffect(() => {
    if (!type.google || typeof document === "undefined") return;
    const href = `https://fonts.googleapis.com/css2?${type.google}&display=swap`;
    const id = `sf-compose-type-${type.id}`;
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    } else if (link.href !== href) {
      link.href = href;
    }
  }, [type.id, type.google]);

  function toggleMulti(
    axis: "research" | "references" | "trends",
    id: string,
    max: number
  ) {
    setPresetId(null);
    updateMix((prev) => {
      const arr = [...(prev[axis] || [])];
      const i = arr.indexOf(id);
      if (i >= 0) arr.splice(i, 1);
      else {
        if (arr.length >= max) arr.shift();
        arr.push(id);
      }
      const patch =
        axis === "trends" && i < 0 ? suggestedFields([id], trendItems) : {};
      return { ...prev, [axis]: arr, ...patch };
    });
  }

  function setOne(axis: "color" | "type" | "density", id: string) {
    setPresetId(null);
    updateMix((prev) => ({ ...prev, [axis]: id }));
  }

  function applyPreset(id: string) {
    const found = presets.items.find((p) => p.id === id);
    if (!found) return;
    setPresetId(id);
    updateMix(() => ({ ...found.mix, trends: [] }));
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
          <label htmlFor="save-name">{t("compose.saveMix")}</label>
          <input
            id="save-name"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder={t("compose.saveName")}
          />
        </div>
        <Button type="button" disabled={busy} onClick={saveCurrent}>
          {t("compose.save")}
        </Button>
        <Button type="button" variant="ghost" disabled={busy} onClick={exportKit}>
          {t("compose.download")}
        </Button>
      </div>

      {newCount > 0 ? (
        <div className={styles.banner}>
          <p>
            {t("compose.syncBanner", { n: newCount })}
          </p>
          <Button type="button" disabled={busy} onClick={openSync}>
            {t("compose.syncApply")}
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
              {t("compose.syncConfirm")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSyncOpen(false);
                setStatus("Sync dismissed — mix unchanged.");
              }}
            >
              {t("compose.syncDismiss")}
            </Button>
          </div>
        </div>
      ) : null}

      {status ? <p className={styles.status}>{status}</p> : null}

      <div className={styles.presets} role="group" aria-label={t("compose.presets")}>
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
              {[...researchItems]
                .sort(
                  (a, b) =>
                    (b.year || 0) - (a.year || 0) || a.title.localeCompare(b.title)
                )
                .map((item) => (
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
                    {item.year ? <span className={styles.year}>{item.year}</span> : null}
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
                    {locale === "ko" ? item.ko || item.en : item.en}
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
                      {locale === "ko" && item.ko ? (
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

          <Axis
            title={`${typeData.label} (${typeItems.length})`}
            hint={t("compose.typeHint", { id: recommendedTypeId })}
          >
            <div className={styles.optGrid}>
              {typeItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.chip}
                  aria-pressed={mix.type === item.id}
                  onClick={() => setOne("type", item.id)}
                  style={
                    mix.type === item.id
                      ? {
                          fontFamily: `"${item.display}", ${item.fallbacks}`,
                        }
                      : undefined
                  }
                >
                  <strong>
                    {item.name}
                    {locale === "ko" && item.ko ? (
                      <span className={styles.ko}>{item.ko}</span>
                    ) : null}
                    {item.recommended || item.id === recommendedTypeId ? (
                      <span className={styles.badgeRec}>{t("compose.recommended")}</span>
                    ) : null}
                    {item.hangul ? (
                      <span className={styles.badgeHangul}>{t("compose.hangulNote")}</span>
                    ) : null}
                  </strong>
                  <span className={styles.meta}>
                    {item.category ? `${item.category} · ` : ""}
                    {item.rationale}
                  </span>
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
                    {locale === "ko" && item.ko ? (
                      <span className={styles.ko}>{item.ko}</span>
                    ) : null}
                  </strong>
                </button>
              ))}
            </div>
          </Axis>
        </div>

        <aside className={styles.side}>
          <div
            className={styles.stage}
            data-surface={surfaceMode}
            style={
              {
                ...mixTokens,
                background:
                  mixTokens["--page-atmosphere"] ||
                  mixTokens["--color-field"],
              } as React.CSSProperties
            }
          >
            <Specimen
              style={specimenStyle}
              surface={surfaceMode}
              title="Live mix"
              trends={mix.trends || []}
              references={mix.references || []}
              meta={`${mix.research.join(" · ") || "no research"} · ${mix.color} · ${mix.type} · ${mix.density}${(mix.trends || []).length ? ` · ${(mix.trends || []).join(" · ")}` : ""}`}
              swatches={color.swatches}
            />
          </div>
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
