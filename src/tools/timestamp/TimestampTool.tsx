import { useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { Field, FieldRow } from '../../components/Field'
import { TimeZoneSelect } from '../../components/TimeZoneSelect'
import { ToolPage } from '../../components/ToolPage'
import { ValueList } from '../../components/ValueList'
import { formatDate, formatRelative, localTimeZone, useNow } from '../../lib/time'
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
      <FieldRow>
        <Field
          id="ts-input"
          label="Timestamp or date"
          error={error}
          hint={parsed ? `Read as ${parsed.interpretedAs.toLowerCase()}` : `Now: ${Math.floor(now.getTime() / 1000)}`}
          grow
        >
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
        </Field>
        <Field id="ts-zone" label="Time zone">
          <TimeZoneSelect id="ts-zone" value={zone} onChange={setZone} />
        </Field>
      </FieldRow>
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
