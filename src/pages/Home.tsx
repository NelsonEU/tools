import { Link } from 'react-router'
import { tools } from '../tools/registry'

export function Home() {
  return (
    <>
      <h1>Dev tools</h1>
      {tools.length === 0 ? (
        <p>No tools yet.</p>
      ) : (
        <ul>
          {tools.map((t) => (
            <li key={t.path}>
              <Link to={`/${t.path}`}>{t.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
