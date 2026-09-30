import type { ReactNode } from 'react'
import styles from './ToolPage.module.css'

type Props = {
  title: string
  description: string
  children: ReactNode
}

export function ToolPage({ title, description, children }: Props) {
  return (
    <article className={styles.page}>
      <header>
        <h1>{title}</h1>
        <p className={styles.description}>{description}</p>
      </header>
      {children}
    </article>
  )
}
