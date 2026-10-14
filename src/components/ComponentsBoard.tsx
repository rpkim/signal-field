"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Field } from "./Field";
import styles from "./ComponentsBoard.module.css";

const toc = [
  ["button", "Button"],
  ["link", "Text link"],
  ["field", "Field / select"],
  ["choice", "Checkbox · radio · switch"],
  ["nav", "Navigation"],
  ["list", "List"],
  ["card", "Interactive card"],
  ["dialog", "Dialog"],
  ["alert", "Toast / alert"],
  ["badge", "Badge / tag"],
  ["tabs", "Tabs"],
  ["table", "Table"],
  ["breadcrumb", "Breadcrumb"],
  ["pagination", "Pagination"],
  ["menu", "Menu"],
  ["disclosure", "Disclosure"],
  ["progress", "Progress / skeleton"],
  ["empty", "Empty state"],
  ["avatar", "Avatar"],
  ["tooltip", "Tooltip"],
  ["divider", "Divider"],
  ["segment", "Segmented control"],
] as const;

export function ComponentsBoard() {
  const [listSel, setListSel] = useState("alpha");
  const [cardSel, setCardSel] = useState("a");
  const [tab, setTab] = useState("overview");
  const [page, setPage] = useState(2);
  const [dialogOpen, setDialogOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState("tokens");
  const [segment, setSegment] = useState("week");

  return (
    <>
      <nav className={styles.toc} aria-label="Component index">
        {toc.map(([id, label]) => (
          <a key={id} href={`#c-${id}`}>
            {label}
          </a>
        ))}
      </nav>

      <section className={styles.section} id="c-button">
        <h2>Button</h2>
        <p className={styles.specId}>§4.1 · primary · ghost · danger · disabled</p>
        <p className={styles.note}>
          One primary per region. Min height 44px. Never style non-actions as
          primary.
        </p>
        <div className={styles.row}>
          <Button type="button">Primary</Button>
          <Button type="button" variant="ghost">
            Ghost
          </Button>
          <Button type="button" variant="danger">
            Danger
          </Button>
          <Button type="button" disabled>
            Disabled
          </Button>
        </div>
      </section>

      <section className={styles.section} id="c-link">
        <h2>Text link</h2>
        <p className={styles.specId}>§4.2 · in-content · quiet meta</p>
        <div className={styles.row}>
          <a className={styles.link} href="#c-field">
            Continue to fields
          </a>
          <a className={styles.linkMeta} href="#c-nav">
            Meta / quiet link
          </a>
        </div>
      </section>

      <section className={styles.section} id="c-field">
        <h2>Text field / select</h2>
        <p className={styles.specId}>§4.3 · label · helper · error</p>
        <div className={styles.stack}>
          <Field id="ws" label="Workspace" hint="Shown in the top bar.">
            <input id="ws" defaultValue="Harbor Desk" />
          </Field>
          <Field id="tier" label="Tier">
            <select id="tier" defaultValue="team">
              <option value="solo">Solo</option>
              <option value="team">Team</option>
              <option value="org">Org</option>
            </select>
          </Field>
          <Field id="notes" label="Notes">
            <textarea id="notes" rows={3} defaultValue="Quiet chrome, one accent." />
          </Field>
          <div className={styles.stack}>
            <label htmlFor="err" style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
              Domain
            </label>
            <input
              id="err"
              className={styles.inputError}
              defaultValue="not a domain"
              aria-invalid
              aria-describedby="err-msg"
            />
            <p id="err-msg" className={styles.errorHint}>
              Enter a valid hostname — color alone is not enough.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section} id="c-choice">
        <h2>Checkbox / radio / switch</h2>
        <p className={styles.specId}>§4.4 · hit target ≥ 44px with label</p>
        <div className={styles.demo}>
          <div className={styles.choice}>
            <label>
              <input type="checkbox" defaultChecked /> Compact rows
            </label>
            <label>
              <input type="checkbox" /> Show trends tags
            </label>
          </div>
          <div className={styles.choice} style={{ marginTop: "1rem" }} role="radiogroup" aria-label="Density">
            <label>
              <input type="radio" name="den" defaultChecked /> Default
            </label>
            <label>
              <input type="radio" name="den" /> Compact
            </label>
            <label>
              <input type="radio" name="den" /> Comfortable
            </label>
          </div>
          <label className={styles.switch} style={{ marginTop: "1rem" }}>
            <input type="checkbox" defaultChecked />
            <span className={styles.switchTrack} aria-hidden />
            Email digest
          </label>
        </div>
      </section>

      <section className={styles.section} id="c-nav">
        <h2>Navigation</h2>
        <p className={styles.specId}>§4.5 · brand · links · current page</p>
        <div className={styles.miniNav}>
          <span className={styles.miniBrand}>Signal Field</span>
          <div className={styles.miniLinks}>
            <a href="#c-button">Foundations</a>
            <a href="#c-nav" aria-current="page">
              Components
            </a>
            <a href="#c-card">Compose</a>
          </div>
        </div>
      </section>

      <section className={styles.section} id="c-list">
        <h2>List</h2>
        <p className={styles.specId}>§4.6 · plain · interactive rows</p>
        <div className={styles.row} style={{ alignItems: "flex-start", gap: "2rem" }}>
          <ul className={styles.listPlain}>
            <li>
              <strong>Tokens first</strong>
              Roles before decoration.
            </li>
            <li>
              <strong>Open layout</strong>
              Hairline dividers, not card farms.
            </li>
            <li>
              <strong>One accent</strong>
              Signal family only.
            </li>
          </ul>
          <ul className={styles.listInteractive}>
            {(
              [
                ["alpha", "Precise quiet"],
                ["beta", "Day editorial"],
                ["gamma", "Ink ledger"],
              ] as const
            ).map(([id, label]) => (
              <li key={id}>
                <button
                  type="button"
                  aria-pressed={listSel === id}
                  onClick={() => setListSel(id)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.section} id="c-card">
        <h2>Interactive card / tile</h2>
        <p className={styles.specId}>§4.7 · only when selectable or actionable</p>
        <div className={styles.cardGrid}>
          {(
            [
              ["a", "Signal teal", "Default product chrome"],
              ["b", "Ledger slate", "Dense ops / fintech"],
              ["c", "Day mist", "Editorial daylight"],
            ] as const
          ).map(([id, title, desc]) => (
            <button
              key={id}
              type="button"
              className={styles.card}
              aria-pressed={cardSel === id}
              onClick={() => setCardSel(id)}
            >
              <strong>{title}</strong>
              <span>{desc}</span>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section} id="c-dialog">
        <h2>Dialog / modal</h2>
        <p className={styles.specId}>§4.8 · title · body · actions · focus trap in prod</p>
        <div className={styles.dialogWrap}>
          <div className={styles.row}>
            <Button type="button" onClick={() => setDialogOpen(true)}>
              Show dialog specimen
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDialogOpen(false)}
            >
              Hide
            </Button>
          </div>
          {dialogOpen ? (
            <div className={styles.scrim}>
              <div
                className={styles.dialog}
                role="dialog"
                aria-labelledby="dlg-title"
                aria-modal="true"
              >
                <h3 id="dlg-title">Export kit?</h3>
                <p>
                  Downloads design.md + tokens.css + theme.css for the current
                  mix. Nothing syncs until you confirm.
                </p>
                <div className={styles.dialogActions}>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={() => setDialogOpen(false)}>
                    Download
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className={styles.section} id="c-alert">
        <h2>Toast / inline alert</h2>
        <p className={styles.specId}>§4.9 · info · ok · warn · danger</p>
        <div className={styles.alerts}>
          <div className={styles.alert} role="status">
            <strong>Info</strong>
            Catalog refreshed — open Compose to apply updates.
          </div>
          <div className={`${styles.alert} ${styles.alertOk}`} role="status">
            <strong>OK</strong>
            Kit zip downloaded.
          </div>
          <div className={`${styles.alert} ${styles.alertWarn}`} role="status">
            <strong>Warn</strong>
            Offline propose — review before shipping trends.
          </div>
          <div className={`${styles.alert} ${styles.alertDanger}`} role="alert">
            <strong>Danger</strong>
            Export failed — check mix selection.
          </div>
        </div>
      </section>

      <section className={styles.section} id="c-badge">
        <h2>Badge / tag</h2>
        <p className={styles.specId}>§4.10 · status · meta · quiet labels</p>
        <div className={styles.badges}>
          <span className={styles.badge}>Meta</span>
          <span className={`${styles.badge} ${styles.badgeSignal}`}>Recommended</span>
          <span className={`${styles.badge} ${styles.badgeSolid}`}>New</span>
          <span className={styles.badge}>Hangul</span>
        </div>
      </section>

      <section className={styles.section} id="c-tabs">
        <h2>Tabs</h2>
        <p className={styles.specId}>§4.11 · one panel visible · keyboard in prod</p>
        <div className={styles.tabs}>
          <div className={styles.tabList} role="tablist" aria-label="Kit sections">
            {(
              [
                ["overview", "Overview"],
                ["tokens", "Tokens"],
                ["export", "Export"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className={styles.tabPanel} role="tabpanel">
            {tab === "overview" &&
              "Quiet product chrome. One accent, real space, type that earns its size."}
            {tab === "tokens" &&
              "Color roles, type pairing, density tokens merge into tokens.css."}
            {tab === "export" &&
              "Download kit zip: design.md + tokens.css + theme.css."}
          </div>
        </div>
      </section>

      <section className={styles.section} id="c-table">
        <h2>Table</h2>
        <p className={styles.specId}>§4.12 · dense data · hairline rules</p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Token</th>
                <th>Role</th>
                <th>Never</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>--color-ink</code>
                </td>
                <td>Primary text</td>
                <td>Low-contrast body</td>
              </tr>
              <tr>
                <td>
                  <code>--color-signal</code>
                </td>
                <td>Single accent</td>
                <td>Second purple SaaS accent</td>
              </tr>
              <tr>
                <td>
                  <code>--radius-md</code>
                </td>
                <td>Controls</td>
                <td>Pill farms for everything</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section} id="c-breadcrumb">
        <h2>Breadcrumb</h2>
        <p className={styles.specId}>§4.13 · hierarchy without chrome noise</p>
        <nav className={styles.crumb} aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className={styles.sep} aria-hidden>
            /
          </span>
          <a href="/foundations">Foundations</a>
          <span className={styles.sep} aria-hidden>
            /
          </span>
          <span aria-current="page">Components</span>
        </nav>
      </section>

      <section className={styles.section} id="c-pagination">
        <h2>Pagination</h2>
        <p className={styles.specId}>§4.14 · compact controls · current page clear</p>
        <div className={styles.pager} role="navigation" aria-label="Pagination">
          <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              aria-current={page === n ? "page" : undefined}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          <button type="button" disabled={page === 4} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      </section>

      <section className={styles.section} id="c-menu">
        <h2>Menu / dropdown</h2>
        <p className={styles.specId}>§4.15 · actions · one open menu · Esc closes in prod</p>
        <div className={styles.menuWrap}>
          <Button
            type="button"
            variant="ghost"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            Actions
          </Button>
          {menuOpen ? (
            <ul className={styles.menu} role="menu">
              <li role="none">
                <button type="button" role="menuitem" onClick={() => setMenuOpen(false)}>
                  Duplicate mix
                </button>
              </li>
              <li role="none">
                <button type="button" role="menuitem" onClick={() => setMenuOpen(false)}>
                  Export kit
                </button>
              </li>
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  className={styles.menuDanger}
                  onClick={() => setMenuOpen(false)}
                >
                  Delete
                </button>
              </li>
            </ul>
          ) : null}
        </div>
      </section>

      <section className={styles.section} id="c-disclosure">
        <h2>Disclosure / accordion</h2>
        <p className={styles.specId}>§4.16 · one or many open · no card stacking</p>
        <div className={styles.disclosure}>
          {(
            [
              ["tokens", "Tokens", "Roles map to CSS variables; never hardcode hex in UI."],
              ["motion", "Motion", "Two intentional motions max on visually led pages."],
              ["export", "Export", "Zip carries design.md, tokens.css, and theme.css."],
            ] as const
          ).map(([id, title, body]) => {
            const open = openPanel === id;
            return (
              <div key={id} className={styles.disclosureItem}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenPanel(open ? "" : id)}
                >
                  {title}
                  <span aria-hidden>{open ? "−" : "+"}</span>
                </button>
                {open ? <p>{body}</p> : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.section} id="c-progress">
        <h2>Progress / skeleton</h2>
        <p className={styles.specId}>§4.17 · quiet load · prefer skeleton over spinner theater</p>
        <div className={styles.stack}>
          <div
            className={styles.progress}
            role="progressbar"
            aria-valuenow={62}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Export progress"
          >
            <span style={{ width: "62%" }} />
          </div>
          <div className={styles.skeleton} aria-hidden>
            <div className={styles.skelLine} style={{ width: "72%" }} />
            <div className={styles.skelLine} style={{ width: "48%" }} />
            <div className={styles.skelBlock} />
          </div>
        </div>
      </section>

      <section className={styles.section} id="c-empty">
        <h2>Empty state</h2>
        <p className={styles.specId}>§4.18 · one sentence · one action · no illustration required</p>
        <div className={styles.empty}>
          <p>No saved mixes yet.</p>
          <Button type="button">Open Compose</Button>
        </div>
      </section>

      <section className={styles.section} id="c-avatar">
        <h2>Avatar</h2>
        <p className={styles.specId}>§4.19 · initials fallback · sizes sm · md · lg</p>
        <div className={styles.row}>
          <span className={`${styles.avatar} ${styles.avatarSm}`} aria-label="NS">
            NS
          </span>
          <span className={styles.avatar} aria-label="HK">
            HK
          </span>
          <span className={`${styles.avatar} ${styles.avatarLg}`} aria-label="SF">
            SF
          </span>
        </div>
      </section>

      <section className={styles.section} id="c-tooltip">
        <h2>Tooltip</h2>
        <p className={styles.specId}>§4.20 · short · never essential info · delay in prod</p>
        <div className={styles.tooltipDemo}>
          <button type="button" className={styles.tooltipTrigger}>
            Signal role
            <span className={styles.tooltip} role="tooltip">
              Single accent — never a second purple.
            </span>
          </button>
        </div>
      </section>

      <section className={styles.section} id="c-divider">
        <h2>Divider</h2>
        <p className={styles.specId}>§4.21 · hairline · optional label</p>
        <div className={styles.stack} style={{ maxWidth: "32rem" }}>
          <p className={styles.note} style={{ margin: 0 }}>
            Above the rule — section context.
          </p>
          <hr className={styles.divider} />
          <div className={styles.dividerLabeled}>
            <span>Or continue with</span>
          </div>
          <p className={styles.note} style={{ margin: 0 }}>
            Below — next job, same surface.
          </p>
        </div>
      </section>

      <section className={styles.section} id="c-segment">
        <h2>Segmented control</h2>
        <p className={styles.specId}>§4.22 · mutually exclusive · compact filter</p>
        <div className={styles.segment} role="group" aria-label="Range">
          {(
            [
              ["day", "Day"],
              ["week", "Week"],
              ["month", "Month"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={segment === id}
              onClick={() => setSegment(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
