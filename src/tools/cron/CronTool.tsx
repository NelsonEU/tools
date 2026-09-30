import { useState } from 'react'
import { ToolPage } from '../../components/ToolPage'
import { formatDate, formatRelative, localTimeZone, timeZones, useNow } from '../../lib/time'
import { explainCron, type CronExplanation } from './cron'
import styles from './CronTool.module.css'

const runCount = 10

export default function CronTool() {
  const [expression, setExpression] = useState('*/15 9-17 * * 1-5')
  const [zone, setZone] = useState(localTimeZone)
  const now = useNow()

  let explanation: CronExplanation | undefined
  let error: string | undefined
  if (expression.trim()) {
    try {
      explanation = explainCron(expression, zone, now, runCount)
    } catch (e) {
      error = e instanceof Error ? e.message : String(e)
    }
  }

  return (
    <ToolPage title="Cron explainer" description="Describes a cron expression in plain English and lists its next runs.">
      <div className={styles.inputs}>
        <div className={`${styles.field} ${styles.grow}`}>
          <label htmlFor="cron-expression">Expression</label>
          <input
            id="cron-expression"
            className={styles.expression}
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            spellCheck={false}
            aria-invalid={!!error}
          />
          <p className={error ? styles.error : styles.hint}>
            {error ?? 'minute  hour  day-of-month  month  day-of-week  (optional seconds first, or @daily, @hourly…)'}
          </p>
        </div>
        <div className={styles.field}>
          <label htmlFor="cron-zone">Time zone</label>
          <select id="cron-zone" value={zone} onChange={(e) => setZone(e.target.value)}>
            {timeZones.map((z) => (
              <option key={z}>{z}</option>
            ))}
          </select>
        </div>
      </div>
      {explanation && (
        <>
          <p className={styles.description}>{explanation.description}</p>
          <section>
            <h2 className={styles.heading}>Next {runCount} runs</h2>
            <ol className={styles.runs}>
              {explanation.nextRuns.map((run) => (
                <li key={run.getTime()}>
                  <span>{formatDate(run, zone)}</span>
                  <span className={styles.relative}>{formatRelative(run, now)}</span>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </ToolPage>
  )
}
