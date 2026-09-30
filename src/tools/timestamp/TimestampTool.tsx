import { useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { ToolPage } from '../../components/ToolPage'
import { ValueList } from '../../components/ValueList'
import { formatDate, formatRelative, localTimeZone, timeZones, useNow } from '../../lib/time'
import { formatIsoInZone, parseInstant, type ParsedInstant } from './timestamp'
import styles from './TimestampTool.module.css'

const nowSeconds = () => String(Math.floor(Date.now() / 1000))

export default function TimestampTool() {
  const [input, setInput] = useState(nowSeconds)
  const [zone, setZone] = useState('UTC')
  const now = useNow()

  const result = useMemo((): { parsed?: ParsedInstant; error?: string } => {
    if (!input.trim()) return {}
    try {
      return { parsed: parseInstant(input) }
    } catch (e) {
      return { error: (e as Error).message }
    }
  }, [input])

  const { parsed, error } = result
  const date = parsed?.date

  return (
    <ToolPage
      title="Timestamp converter"
      description="Unix timestamps in seconds, milliseconds, microseconds or nanoseconds (detected from the size), or any ISO 8601 date."
    >
      <div className={styles.inputs}>
        <div className={`${styles.field} ${styles.grow}`}>
          <label htmlFor="ts-input">Timestamp or date</label>
          <div className={styles.row}>
            <input
              id="ts-input"
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="1790856000 or 2026-10-01T12:00:00Z"
              spellCheck={false}
              aria-invalid={!!error}
            />
            <Button onClick={() => setInput(nowSeconds())}>Now</Button>
          </div>
          <p className={error ? styles.error : styles.hint}>
            {error ?? (parsed ? `Read as ${parsed.interpretedAs.toLowerCase()}` : `Now: ${Math.floor(now.getTime() / 1000)}`)}
          </p>
        </div>
        <div className={styles.field}>
          <label htmlFor="ts-zone">Time zone</label>
          <select id="ts-zone" value={zone} onChange={(e) => setZone(e.target.value)}>
            {timeZones.map((z) => (
              <option key={z}>{z}</option>
            ))}
          </select>
        </div>
      </div>
      {date && (
        <ValueList
          rows={[
            { label: 'Unix seconds', value: String(Math.floor(date.getTime() / 1000)) },
            { label: 'Unix milliseconds', value: String(date.getTime()) },
            { label: 'ISO 8601 (UTC)', value: date.toISOString() },
            ...(zone === 'UTC' ? [] : [{ label: `ISO 8601 (${zone})`, value: formatIsoInZone(date, zone) }]),
            { label: zone, value: formatDate(date, zone) },
            { label: `Local (${localTimeZone})`, value: formatDate(date) },
            { label: 'Relative', value: formatRelative(date, now) },
          ]}
        />
      )}
    </ToolPage>
  )
}
