import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import styles from "@/styles/pages.module.css";

const links = [
  {
    href: "/foundations",
    kicker: "Guide",
    title: "Foundations",
    desc: "Color roles, type, space, motion, accessibility.",
  },
  {
    href: "/components",
    kicker: "Guide",
    title: "Components",
    desc: "Buttons, fields, focus — states before decoration.",
  },
  {
    href: "/compose",
    kicker: "Tools",
    title: "Compose",
    desc: "Mix research, references, color, type, density — export a kit.",
  },
  {
    href: "/recommend",
    kicker: "Tools",
    title: "Recommend",
    desc: "Describe a service; get a ranked theme mix.",
  },
  {
    href: "/rebrand",
    kicker: "Tools",
    title: "Rebrand",
    desc: "Analyze existing CSS, generate a hook, preview before/after.",
  },
  {
    href: "/trends",
    kicker: "Canon",
    title: "Trends",
    desc: "Current visual trends mapped to research and refs.",
  },
  {
    href: "/research",
    kicker: "Canon",
    title: "Research",
    desc: "Pillars that constrain Compose — WCAG, roles, deference.",
  },
  {
    href: "/kits/precise-quiet",
    kicker: "Kit",
    title: "precise-quiet",
    desc: "Default brand kit specimen — IBM Plex, signal teal.",
  },
];

export default function HomePage() {
  return (
    <AppShell current="/">
      <p className={styles.brand}>Signal Field</p>
      <p className={styles.lede}>
        A quiet product design system. Clarity, deference, and depth — one
        accent, real space, type that earns its size.
      </p>

      <section className={styles.section} aria-labelledby="meta">
        <h2 id="meta">Meta</h2>
        <div className={styles.tableWrap}>
          <table className={styles.spec}>
            <thead>
              <tr>
                <th>Principle</th>
                <th>Meaning</th>
                <th>Never</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Clarity</strong>
                </td>
                <td>Content and action legible at a glance</td>
                <td>Low-contrast icons as sole affordance</td>
              </tr>
              <tr>
                <td>
                  <strong>Deference</strong>
                </td>
                <td>Chrome yields to content</td>
                <td>Chrome that outranks the work</td>
              </tr>
              <tr>
                <td>
                  <strong>Depth</strong>
                </td>
                <td>Hierarchy via space and type</td>
                <td>Glow stacks and badge clutter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <nav className={styles.homeGrid} aria-label="Sections">
        {links.map((item) => (
          <Link key={item.href} href={item.href}>
            <span className={styles.kicker}>{item.kicker}</span>
            <span>
              <span className={styles.gridTitle}>{item.title}</span>
              <p className={styles.gridDesc}>{item.desc}</p>
            </span>
          </Link>
        ))}
      </nav>
    </AppShell>
  );
}
