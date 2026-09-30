import { Suspense } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import styles from './Layout.module.css'
import { categories, tools } from './tools/registry'

export function Layout() {
  return (
    <div className={styles.shell}>
      <nav className={styles.sidebar}>
        <Link to="/" className={styles.brand}>
          tools<span className={styles.caret}>_</span>
        </Link>
        {categories.map((category) => (
          <section key={category}>
            <h2 className={styles.category}>{category}</h2>
            {tools
              .filter((t) => t.category === category)
              .map((t) => (
                <NavLink
                  key={t.path}
                  to={`/${t.path}`}
                  className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
                >
                  {t.name}
                </NavLink>
              ))}
          </section>
        ))}
      </nav>
      <main className={styles.main}>
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
