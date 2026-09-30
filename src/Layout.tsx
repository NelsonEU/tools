import { Suspense } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import styles from './Layout.module.css'
import { tools } from './tools/registry'

const categories = [...new Set(tools.map((t) => t.category))]

export function Layout() {
  return (
    <div className={styles.shell}>
      <nav className={styles.sidebar}>
        <Link to="/" className={styles.brand}>
          tools
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
