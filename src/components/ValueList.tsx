import { CopyButton } from './CopyButton'
import styles from './ValueList.module.css'

export type ValueRow = {
  label: string
  value: string
}

export function ValueList({ rows }: { rows: ValueRow[] }) {
  return (
    <dl className={styles.list}>
      {rows.map(({ label, value }) => (
        <div key={label} className={styles.row}>
          <dt className={styles.label}>{label}</dt>
          <dd className={styles.value}>{value}</dd>
          <CopyButton text={value} />
        </div>
      ))}
    </dl>
  )
}
