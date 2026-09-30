import { Suspense, type ReactNode } from 'react'
import type { Tool } from '../tools/registry'
import styles from './ToolPage.module.css'

export function ToolPage({ tool, children }: { tool: Tool; children: ReactNode }) {
  return (
    <article className={styles.page}>
      <title>{`${tool.name} · tools`}</title>
      <header>
        <h1>{tool.name}</h1>
        <p className={styles.description}>{tool.description}</p>
      </header>
      <Suspense fallback={null}>{children}</Suspense>
    </article>
  )
}
