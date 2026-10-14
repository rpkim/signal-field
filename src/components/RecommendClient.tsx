"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./Button";
import { Field } from "./Field";
import { composeHref, recommend } from "@/lib/recommend";
import styles from "./RecommendClient.module.css";

export function RecommendClient() {
  const [brief, setBrief] = useState(
    "B2B admin console for ledger ops — dense tables, quiet chrome, accessibility floor."
  );
  const [result, setResult] = useState(() => recommend(brief));

  function run(e?: React.FormEvent) {
    e?.preventDefault();
    setResult(recommend(brief));
  }

  return (
    <div>
      <form className={styles.form} onSubmit={run}>
        <Field
          id="brief"
          label="Service brief"
          hint="Product type, audience, density, tone (new or existing)."
        >
          <textarea
            id="brief"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
          />
        </Field>
        <div>
          <Button type="submit">Rank themes</Button>
        </div>
      </form>

      <div className={styles.results}>
        {result.picks.map((pick, i) => (
          <article key={pick.rule.id} className={styles.pick}>
            <p className={styles.rank}>
              Rank {i + 1}
              {pick.score ? ` · score ${pick.score}` : " · fallback"}
            </p>
            <h3>{pick.rule.id}</h3>
            <p className={styles.why}>{pick.rule.why}</p>
            <p className={styles.tags}>
              <span>{pick.rule.mix.color}</span>
              <span>·</span>
              <span>{pick.rule.mix.type}</span>
              <span>·</span>
              <span>{pick.rule.mix.density}</span>
              {pick.rule.trends.map((t) => (
                <span key={t}>· {t}</span>
              ))}
            </p>
            <div>
              <Link href={composeHref(pick.rule.mix)} style={{ textDecoration: "none" }}>
                Open in Compose →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {result.rebrand ? (
        <p className={styles.note}>
          Existing product brief — applying Signal Field (
          <Link href="/doc">design.md</Link> + Compose kit) is the rebrand.
          Open the primary mix in Compose and Download kit.
        </p>
      ) : null}
    </div>
  );
}
