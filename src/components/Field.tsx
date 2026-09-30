import type { ReactNode } from 'react'
import styles from './Field.module.css'

type Props = {
  id: string
  label: string
  hint?: string
  error?: string
  grow?: boolean
  children: ReactNode
}

export function Field({ id, label, hint, error, grow, children }: Props) {
  const message = error ?? hint
  return (
    <div className={grow ? `${styles.field} ${styles.grow}` : styles.field}>
      <label htmlFor={id}>{label}</label>
      {children}
      {message && <p className={error ? styles.error : styles.hint}>{message}</p>}
    </div>
  )
}

export function FieldRow({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>
}
