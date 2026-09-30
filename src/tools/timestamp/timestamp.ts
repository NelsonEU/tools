export type ParsedInstant = {
  date: Date
  interpretedAs: string
}

const numericUnits: [string, number, number][] = [
  ['seconds', 1e11, 1000],
  ['milliseconds', 1e14, 1],
  ['microseconds', 1e17, 1e-3],
  ['nanoseconds', Infinity, 1e-6],
]

export function parseInstant(input: string): ParsedInstant {
  const text = input.trim()
  if (/^-?\d+(\.\d+)?$/.test(text)) {
    const value = Number(text)
    const [unit, , toMs] = numericUnits.find(([, limit]) => Math.abs(value) < limit)!
    const date = new Date(value * toMs)
    if (isNaN(date.getTime())) throw new Error('Timestamp is out of range')
    return { date, interpretedAs: `Unix ${unit}` }
  }
  const date = new Date(text)
  if (isNaN(date.getTime())) throw new Error('Not a Unix timestamp or a recognised date (try ISO 8601, e.g. 2026-09-30T12:00:00Z)')
  return { date, interpretedAs: 'Date string' }
}

export function formatIsoInZone(date: Date, timeZone: string): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
      hourCycle: 'h23',
      timeZoneName: 'longOffset',
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  )
  const offset = parts.timeZoneName === 'GMT' ? '+00:00' : parts.timeZoneName.slice(3)
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}.${parts.fractionalSecond}${offset}`
}
