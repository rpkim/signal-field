import type { CSSProperties } from "react";
import styles from "./Specimen.module.css";

type Props = {
  style?: CSSProperties;
  title?: string;
  meta?: string;
  swatches?: string[];
};

export function Specimen({
  style,
  title = "Specimen",
  meta,
  swatches = [],
}: Props) {
  return (
    <article className={styles.root} style={style} aria-label="Live specimen">
      <p className={styles.mark}>{title}</p>
      <h2 className={styles.display}>Signal Field</h2>
      <p className={styles.body}>
        Quiet product chrome. One accent, graphite ink, paper field — hierarchy
        from type and space, not badges.
      </p>
      {swatches.length ? (
        <div className={styles.swatches} aria-hidden>
          {swatches.map((hex) => (
            <i key={hex} style={{ background: hex }} />
          ))}
        </div>
      ) : null}
      <div className={styles.actions}>
        <button type="button" className={styles.primary}>
          Primary
        </button>
        <button type="button" className={styles.ghost}>
          Ghost
        </button>
      </div>
      <div className={styles.field}>
        <label htmlFor="specimen-field">Label</label>
        <input id="specimen-field" defaultValue="Workspace name" readOnly />
      </div>
      {meta ? <p className={styles.meta}>{meta}</p> : null}
    </article>
  );
}
