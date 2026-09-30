import { Link } from 'react-router'
import { categories, tools } from '../tools/registry'
import styles from './Home.module.css'

export function Home() {
  return (
    <div className={styles.home}>
      <title>Arnaud's tools</title>
      <header className={styles.hero}>
        <h1 className={styles.title}>
          tools<span className={styles.caret}>_</span>
        </h1>
        <p className={styles.tagline}>Small utilities for everyday dev work: paste something in, get the answer out.</p>
        <p className={styles.privacy}>Everything runs in your browser. Nothing you paste is sent anywhere.</p>
      </header>
      {categories.map((category) => (
        <section key={category} className={styles.section}>
          <h2 className={styles.category}>{category}</h2>
          <div className={styles.grid}>
            {tools
              .filter((t) => t.category === category)
              .map((t) => (
                <Link key={t.path} to={`/${t.path}`} className={styles.card}>
                  <span className={styles.icon} aria-hidden="true">
                    {t.icon}
                  </span>
                  <span className={styles.name}>{t.name}</span>
                  <span className={styles.description}>{t.description}</span>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}
