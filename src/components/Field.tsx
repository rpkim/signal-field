import styles from "./Field.module.css";

type Props = {
  label: string;
  id: string;
  children: React.ReactNode;
  hint?: string;
};

export function Field({ label, id, children, hint }: Props) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint ? <p className={styles.hint}>{hint}</p> : null}
    </div>
  );
}
