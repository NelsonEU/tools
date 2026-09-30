import { CronExpressionParser } from 'cron-parser'
import cronstrue from 'cronstrue'

export type CronExplanation = {
  description: string
  nextRuns: Date[]
}

export function explainCron(expression: string, timeZone: string, from: Date, count: number): CronExplanation {
  const text = expression.trim()
  const fields = text.split(/\s+/).length
  if (!text.startsWith('@') && (fields < 5 || fields > 6)) {
    throw new Error(`Expected 5 fields (or 6 with seconds first), got ${fields}`)
  }
  const schedule = CronExpressionParser.parse(text, { tz: timeZone, currentDate: from })
  return {
    description: cronstrue.toString(text, { use24HourTimeFormat: true }),
    nextRuns: schedule.take(count).map((d) => d.toDate()),
  }
}
