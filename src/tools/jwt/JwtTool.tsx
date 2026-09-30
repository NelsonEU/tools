import { useMemo, useState } from 'react'
import { TextField } from '../../components/TextField'
import { ToolPage } from '../../components/ToolPage'
import { formatDate, formatRelative, useNow } from '../../lib/time'
import { decodeJwt, timeClaims, tokenStatus, type DecodedJwt, type TokenStatus } from './jwt'
import styles from './JwtTool.module.css'

const statusClass: Record<TokenStatus, string> = {
  Valid: styles.valid,
  Expired: styles.invalid,
  'Not yet valid': styles.invalid,
  'No expiry': styles.neutral,
}

export default function JwtTool() {
  const [token, setToken] = useState('')
  const now = useNow()

  const result = useMemo((): { jwt?: DecodedJwt; error?: string } => {
    if (!token.trim()) return {}
    try {
      return { jwt: decodeJwt(token) }
    } catch (e) {
      return { error: (e as Error).message }
    }
  }, [token])

  const { jwt, error } = result
  const status = jwt && tokenStatus(jwt.payload, now)
  const claims = jwt ? timeClaims(jwt.payload) : []

  return (
    <ToolPage
      title="JWT decoder"
      description="Decodes the header and payload locally, nothing leaves your browser. The signature is not verified."
    >
      <div className={styles.layout}>
        <TextField label="Token" value={token} onChange={setToken} error={error} placeholder="eyJhbGciOi…" rows={14} />
        {jwt && status && (
          <div className={styles.decoded}>
            <p className={`${styles.status} ${statusClass[status]}`}>{status}</p>
            {claims.length > 0 && (
              <table className={styles.claims}>
                <tbody>
                  {claims.map(({ claim, label, date }) => (
                    <tr key={claim}>
                      <th scope="row">
                        {label} <code>{claim}</code>
                      </th>
                      <td>{formatDate(date)}</td>
                      <td className={styles.relative}>{formatRelative(date, now)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <TextField label="Header" value={JSON.stringify(jwt.header, null, 2)} rows={5} />
            <TextField label="Payload" value={JSON.stringify(jwt.payload, null, 2)} rows={12} />
            <TextField label="Signature (not verified)" value={jwt.signature} rows={2} />
          </div>
        )}
      </div>
    </ToolPage>
  )
}
