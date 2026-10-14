import Link from "next/link";
import { listSavedMixes } from "@/lib/savedMixes";
import styles from "@/styles/pages.module.css";

export async function SavedMixes() {
  const items = await listSavedMixes();

  return (
    <section className={styles.section} aria-labelledby="saved-mixes">
      <h2 id="saved-mixes">Saved mixes</h2>
      {items.length === 0 ? (
        <p>
          No saves yet. In Compose, name a mix and press <strong>Save</strong>.
          Files live in <code>content/saved-mixes.json</code>.
        </p>
      ) : (
        <ul className={styles.listPlain}>
          {items.map((item) => (
            <li key={item.id}>
              <span className={styles.meta}>
                {new Date(item.createdAt).toLocaleString()}
              </span>
              <strong>{item.name}</strong>
              <p style={{ margin: "0.35rem 0 0", fontSize: "var(--text-sm)" }}>
                {item.mix.color} · {item.mix.type} · {item.mix.density}
                {item.mix.research?.length
                  ? ` · research ${item.mix.research.join(", ")}`
                  : ""}
                {item.mix.trends?.length
                  ? ` · trends ${item.mix.trends.join(", ")}`
                  : ""}
              </p>
              <p style={{ margin: "0.5rem 0 0" }}>
                <Link href={`/compose?save=${encodeURIComponent(item.id)}`}>
                  Load in Compose →
                </Link>
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
