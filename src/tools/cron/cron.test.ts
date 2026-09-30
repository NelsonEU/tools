import { describe, expect, it } from 'vitest'
import { explainCron } from './cron'

const from = new Date('2026-10-01T12:00:00Z')

describe('explainCron', () => {
  it('describes the schedule in 24-hour time', () => {
    expect(explainCron('*/15 9-17 * * 1-5', 'UTC', from, 1).description).toBe(
      'Every 15 minutes, between 09:00 and 17:59, Monday through Friday',
    )
  })

  it('computes next runs in the given time zone', () => {
    const runs = explainCron('0 9 * * *', 'Europe/Brussels', from, 2).nextRuns
    expect(runs.map((d) => d.toISOString())).toEqual(['2026-10-02T07:00:00.000Z', '2026-10-03T07:00:00.000Z'])
  })

  it('follows DST changes', () => {
    const runs = explainCron('0 9 * * *', 'Europe/Brussels', new Date('2026-10-24T12:00:00Z'), 2).nextRuns
    expect(runs.map((d) => d.toISOString())).toEqual(['2026-10-25T08:00:00.000Z', '2026-10-26T08:00:00.000Z'])
  })

  it('supports seconds and presets', () => {
    expect(explainCron('30 0 9 * * *', 'UTC', from, 1).nextRuns[0].toISOString()).toBe('2026-10-02T09:00:30.000Z')
    expect(explainCron('@hourly', 'UTC', from, 1).nextRuns[0].toISOString()).toBe('2026-10-01T13:00:00.000Z')
  })

  it('rejects invalid expressions', () => {
    expect(() => explainCron('* * *', 'UTC', from, 1)).toThrow('got 3')
    expect(() => explainCron('61 * * * *', 'UTC', from, 1)).toThrow()
  })
})
