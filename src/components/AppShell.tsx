import { SiteFooter } from "./SiteFooter";
import { SiteNav } from "./SiteNav";
import styles from "./AppShell.module.css";

export function AppShell({
  current,
  children,
}: {
  current?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteNav current={current} />
      <main className={styles.main}>
        <div className={styles.wrap}>{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
