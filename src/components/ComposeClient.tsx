"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import colors from "@/data/colors.json";
import density from "@/data/density.json";
import presets from "@/data/presets.json";
import references from "@/data/references.json";
import research from "@/data/research.json";
import typeData from "@/data/type.json";
import { buildDesignMd, buildTokensCss, downloadText } from "@/lib/exportKit";
import type { ColorItem, DensityItem, MixState, TypeItem } from "@/lib/types";
import { Button } from "./Button";
import { Specimen } from "./Specimen";
import styles from "./ComposeClient.module.css";

const colorItems = colors.items as ColorItem[];
const typeItems = typeData.items as TypeItem[];
const densityItems = density.items as DensityItem[];

const DEFAULT: MixState = {
  research: ["wcag-22", "m3-roles"],
  references: ["ibm-lang"],
  color: "signal-teal",
  type: "plex",
  density: "default",
};

function byId<T extends { id: string }>(list: T[], id: string) {
  return list.find((x) => x.id === id) ?? list[0];
}

export function ComposeClient() {
  const params = useSearchParams();
  const [mix, setMix] = useState<MixState>(DEFAULT);
  const [presetId, setPresetId] = useState<string | null>("precise-quiet");

  useEffect(() => {
    const next: MixState = { ...DEFAULT };
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
    if (color) next.color = color;
    if (type) next.type = type;
    if (dens) next.density = dens;
    if (res) next.research = res.split(",").filter(Boolean);
    if (refs) next.references = refs.split(",").filter(Boolean);
    setMix(next);
  }, [params]);

  const color = byId(colorItems, mix.color);
  const type = byId(typeItems, mix.type);
  const dens = byId(densityItems, mix.density);

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
    axis: "research" | "references",
    id: string,
    max: number
  ) {
    setPresetId(null);
    setMix((prev) => {
      const arr = [...prev[axis]];
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
    setMix({ ...found.mix });
  }

  function exportKit() {
    downloadText("tokens.css", buildTokensCss(mix, color, type, dens), "text/css");
    downloadText("design.md", buildDesignMd(mix), "text/markdown");
  }

  return (
    <div>
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
            title={`${research.label}`}
            hint={`Select up to ${research.max}`}
          >
            <div className={styles.optGrid}>
              {research.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.chip}
                  aria-pressed={mix.research.includes(item.id)}
                  onClick={() => toggleMulti("research", item.id, research.max)}
                >
                  <strong>{item.title}</strong>
                  <span className={styles.meta}>
                    {item.implications?.[0] ?? ""}
                  </span>
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
            meta={`${mix.color} · ${mix.type} · ${mix.density}`}
            swatches={color.swatches}
          />
          <div className={styles.exportRow}>
            <Button type="button" onClick={exportKit}>
              Download kit
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                downloadText(
                  "tokens.css",
                  buildTokensCss(mix, color, type, dens),
                  "text/css"
                )
              }
            >
              tokens.css
            </Button>
          </div>
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
