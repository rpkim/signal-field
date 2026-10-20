"use client";

import { flushSync } from "react-dom";
import { useState, type CSSProperties } from "react";
import styles from "./Specimen.module.css";

type Props = {
  style?: CSSProperties;
  title?: string;
  meta?: string;
  swatches?: string[];
  surface?: string;
  trends?: string[];
  references?: string[];
};

const REFERENCE_SCENES: Record<string, { kicker: string; line: string }> = {
  govuk: { kicker: "Service", line: "Start now. One action, in plain words." },
  "ibm-lang": { kicker: "Roles", line: "Surface and on-surface. The accent stays one role." },
  polaris: { kicker: "Commerce", line: "Field notebook · $48. The form stays strict." },
  atlassian: { kicker: "Dense product", line: "Issue 142 · In progress · One line, no card." },
  awwwards: { kicker: "Craft", line: "A larger name, a little grain, motion kept short." },
  brandnew: { kicker: "Longevity", line: "Will this still read in five years?" },
  material: { kicker: "Roles", line: "A paired surface, a softer corner, still one accent." },
  "apple-hig": { kicker: "Deference", line: "The sentence leads. The corner softens. Chrome stays back." },
  primer: { kicker: "Developer", line: "main · quiet · Compact type on a flat field." },
  cloudscape: { kicker: "Console", line: "Name and status align on a firm hairline." },
  uswds: { kicker: "Public service", line: "Larger type. A 48px target. No decoration." },
  nhs: { kicker: "Care", line: "What happens next. Short steps, a calmer field." },
};

function has(trends: string[], ...ids: string[]) {
  return ids.some((id) => trends.includes(id));
}

export function Specimen({
  style,
  title = "Specimen",
  meta,
  swatches = [],
  surface = "solid",
  trends = [],
  references = [],
}: Props) {
  const [swapped, setSwapped] = useState(false);
  const chromatic = has(trends, "chromatic-restraint", "single-chromatic-anchor");
  const kinetic = has(trends, "kinetic-lockups");
  const fluid = has(trends, "fluid-rem-type");
  const deference = has(trends, "deference-chrome");
  const guidelines = has(trends, "guidelines-framing");
  const oklch = has(trends, "oklch-color-mix");
  const popover = has(trends, "native-popover");
  const queries = has(trends, "container-queries");
  const motion = has(trends, "restrained-view-transitions");
  const commerce = has(trends, "quiet-commerce");
  const telemetry = has(trends, "tabular-telemetry-typography");
  const rules = has(trends, "rule-grid-data-sheets");
  const contrast = has(trends, "utility-contrast", "user-contrast");
  const grain = has(trends, "soft-grain");
  const kit = has(trends, "compose-export");
  const dense = guidelines || kit || rules || telemetry;
  const scene =
    guidelines ||
    fluid ||
    oklch ||
    queries ||
    commerce ||
    telemetry ||
    rules ||
    kit ||
    popover ||
    motion ||
    contrast;

  function swapState() {
    const next = !swapped;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => setSwapped(next));
      });
      return;
    }
    setSwapped(next);
  }

  let lede =
    surface === "glass"
      ? "Liquid glass chrome: translucent material, soft blur, content ahead of decoration."
      : "Quiet product chrome. One accent, graphite ink, paper field — hierarchy from type and space, not badges.";
  if (chromatic) lede = "One accent. It is reserved for the primary action.";
  if (kinetic) lede = "The name enters once. Reduced motion keeps it still.";
  if (deference) lede = "The sentence leads. Controls stay out of the way.";
  if (grain) lede = "A soft grain sits on the field. The type stays flat.";
  if (scene) lede = "";

  return (
    <article
      className={`${styles.root}${kinetic ? ` ${styles.kinetic}` : ""}${deference ? ` ${styles.quiet}` : ""}${grain ? ` ${styles.grain}` : ""}${motion ? ` ${styles.live}` : ""}`}
      style={style}
      data-surface={surface}
      aria-label="Live specimen"
    >
      <p className={styles.mark}>{title}</p>
      <h2 className={styles.display} key={kinetic ? "lockup" : "still"}>
        {commerce ? "Field notebook" : "Signal Field"}
      </h2>
      {lede ? <p className={styles.body}>{lede}</p> : null}

      {references.map((id) => {
        const scene = REFERENCE_SCENES[id];
        if (!scene) return null;
        return (
          <p key={id} className={styles.refLine}>
            <span>{scene.kicker}</span>
            {scene.line}
          </p>
        );
      })}

      {guidelines ? (
        <ol className={styles.outline}>
          <li>Philosophy</li>
          <li>Foundations</li>
          <li>Components</li>
        </ol>
      ) : null}

      {fluid ? (
        <ul className={styles.ramp}>
          <li style={{ fontSize: "var(--text-xs)" }}>Caption</li>
          <li style={{ fontSize: "var(--text-sm)" }}>Label</li>
          <li style={{ fontSize: "var(--text-base)" }}>Body</li>
          <li style={{ fontSize: "var(--text-md, 1.125rem)" }}>Title</li>
        </ul>
      ) : null}

      {oklch ? (
        <ul className={styles.steps}>
          <li>
            <i style={{ background: "var(--color-signal)" }} />
            Signal
          </li>
          <li>
            <i style={{ background: "color-mix(in oklch, var(--color-signal) 82%, white)" }} />
            Hover
          </li>
          <li>
            <i
              style={{
                background: "color-mix(in oklch, var(--color-signal) 16%, var(--color-field))",
              }}
            />
            Surface
          </li>
          <li>
            <i style={{ background: "color-mix(in oklch, var(--color-signal) 72%, black)" }} />
            Pressed
          </li>
        </ul>
      ) : null}

      {queries ? (
        <div className={styles.containers}>
          <div className={styles.panel} data-width="narrow">
            <div className={styles.panelInner}>
              <span>Narrow</span>
              <strong>Stacked</strong>
            </div>
          </div>
          <div className={styles.panel} data-width="wide">
            <div className={styles.panelInner}>
              <span>Wide</span>
              <strong>In a row</strong>
            </div>
          </div>
        </div>
      ) : null}

      {commerce ? (
        <p className={styles.product}>
          <span>Stone cover</span>
          <span className={styles.price}>$48</span>
        </p>
      ) : null}

      {telemetry ? (
        <dl className={styles.telemetry}>
          <div>
            <dt>Latency</dt>
            <dd>128 ms</dd>
          </div>
          <div>
            <dt>Queue</dt>
            <dd>1,024</dd>
          </div>
        </dl>
      ) : null}

      {rules ? (
        <table className={styles.sheet}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Northline</td>
              <td>Quiet</td>
            </tr>
            <tr>
              <td>Field</td>
              <td>Open</td>
            </tr>
          </tbody>
        </table>
      ) : null}

      {kit ? (
        <ul className={styles.files}>
          <li>DESIGN.md</li>
          <li>tokens.css</li>
          <li>theme.css</li>
        </ul>
      ) : null}

      {contrast ? (
        <p className={styles.focusSample}>
          <span>Focus ring</span>
        </p>
      ) : null}

      {swatches.length && !scene ? (
        <div className={styles.swatches} aria-hidden>
          {swatches.map((hex) => (
            <i key={hex} style={{ background: hex }} />
          ))}
        </div>
      ) : null}

      <div className={styles.actions}>
        {deference ? null : (
          <button
            type="button"
            className={chromatic ? `${styles.primary} ${styles.signal}` : styles.primary}
          >
            {commerce ? "Add" : "Primary"}
          </button>
        )}
        <button type="button" className={styles.ghost}>
          {deference ? "Continue" : "Ghost"}
        </button>
        {popover ? (
          <button type="button" className={styles.ghost} popoverTarget="specimen-menu">
            Menu
          </button>
        ) : null}
        {motion ? (
          <button type="button" className={styles.ghost} onClick={swapState}>
            {swapped ? "Archive" : "Workspace"}
          </button>
        ) : null}
      </div>

      {popover ? (
        <div id="specimen-menu" popover="auto" className={styles.popover}>
          <p>Confirm this action.</p>
          <button type="button" className={styles.primary} popoverTarget="specimen-menu" popoverTargetAction="hide">
            Confirm
          </button>
        </div>
      ) : null}

      {dense ? null : (
        <div className={styles.field}>
          <label htmlFor="specimen-field">Label</label>
          <input id="specimen-field" value={swapped ? "Archive" : "Workspace name"} readOnly />
        </div>
      )}
      {meta ? <p className={styles.meta}>{meta}</p> : null}
    </article>
  );
}
