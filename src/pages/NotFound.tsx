import { Link } from 'react-router'

export function NotFound() {
  return (
    <>
      <h1>Not found</h1>
      <p>
        No tool here. <Link to="/">Back to the list</Link>
      </p>
    </>
  )
}
