"use client";

import { useEffect, useState } from "react";
import colors from "@/data/colors.json";
import { downloadText } from "@/lib/exportKit";
import { analyzeCss, buildHookCss, type Analysis } from "@/lib/rebrandAnalyze";
import type { ColorItem } from "@/lib/types";
import { Button } from "./Button";
import { Field } from "./Field";
import styles from "./RebrandClient.module.css";

const signal = (colors.items as ColorItem[]).find((c) => c.id === "signal-teal")!;

export function RebrandClient() {
  const [css, setCss] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [hook, setHook] = useState("");
  const [target, setTarget] = useState("signal-teal");

  useEffect(() => {
    fetch("/fixtures/rebrand-demo/old.css")
      .then((r) => r.text())
      .then((t) => setCss(t))
      .catch(() => {
        setCss(`:root {\n  --primary: #4f46e5;\n  --bg: #f8fafc;\n  --text: #0f172a;\n}\nbody { font-family: Inter, system-ui; background: var(--bg); }\n.cta { background: #6366f1; border-radius: 999px; box-shadow: 0 8px 24px rgb(99 102 241 / 0.35); }\n`);
      });
  }, []);

  function runAnalyze() {
    const a = analyzeCss(css);
    setAnalysis(a);
    const roles =
      (colors.items as ColorItem[]).find((c) => c.id === target)?.roles ||
      signal.roles;
    setHook(buildHookCss(a, roles));
  }

  function loadFixture() {
    fetch("/fixtures/rebrand-demo/old.css")
      .then((r) => r.text())
      .then((t) => {
        setCss(t);
        const a = analyzeCss(t);
        setAnalysis(a);
        setHook(buildHookCss(a, signal.roles));
      });
  }

  return (
    <div className={styles.layout}>
      <div className={styles.panel}>
        <Field
          id="css"
          label="Paste existing CSS"
          hint="Fixture Harbor Desk included — or paste your :root / component CSS."
        >
          <textarea
            id="css"
            value={css}
            onChange={(e) => setCss(e.target.value)}
            spellCheck={false}
          />
        </Field>
        <Field id="target" label="Target color direction">
          <select
            id="target"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          >
            {(colors.items as ColorItem[]).slice(0, 8).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <div className={styles.actions}>
          <Button type="button" onClick={runAnalyze}>
            Analyze + hook
          </Button>
          <Button type="button" variant="ghost" onClick={loadFixture}>
            Load Harbor Desk fixture
          </Button>
          {hook ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => downloadText("rebrand-hook.css", hook, "text/css")}
            >
              Download hook
            </Button>
          ) : null}
        </div>

        {analysis ? (
          <div className={styles.findings}>
            <h3>Findings</h3>
            <p>
              {analysis.cssLength} chars · {analysis.colors.length} colors ·{" "}
              {Object.keys(analysis.vars).length} CSS vars
            </p>
            {analysis.defaultBlueSaaS ? (
              <p>Default blue SaaS chroma detected — replace with one accent.</p>
            ) : null}
            {analysis.purpleHeavy ? (
              <p>Purple-heavy palette — Signal Field avoids this cluster.</p>
            ) : null}
            <div className={styles.swatches}>
              {analysis.colors.slice(0, 8).map((c) => (
                <span key={c.hex}>
                  <i style={{ background: c.hex }} />
                  {c.hex} ×{c.count}
                </span>
              ))}
            </div>
            <p>
              Map → ink {analysis.map.ink} · field {analysis.map.field} · signal{" "}
              {analysis.map.signal}
            </p>
            {analysis.fonts.length ? (
              <p>Fonts: {analysis.fonts.slice(0, 3).join(" · ")}</p>
            ) : null}
          </div>
        ) : null}

        {hook ? (
          <pre className={styles.hook} aria-label="Generated hook CSS">
            {hook}
          </pre>
        ) : null}
      </div>

      <div className={styles.preview}>
        <p className={styles.findings}>
          <strong>Before / after fixture</strong>
        </p>
        <div className={styles.frames}>
          <iframe
            title="Before — Harbor Desk"
            src="/fixtures/rebrand-demo/before.html"
          />
          <iframe
            title="After — Signal Field hook"
            src="/fixtures/rebrand-demo/after.html"
          />
        </div>
      </div>
    </div>
  );
}
