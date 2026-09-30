import type { ReactNode } from 'react'
import styles from './Panes.module.css'

export function Panes({ children }: { children: ReactNode }) {
  return <div className={styles.panes}>{children}</div>
}
