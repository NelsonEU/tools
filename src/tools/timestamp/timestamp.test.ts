import { describe, expect, it } from 'vitest'
import { formatIsoInZone, parseInstant } from './timestamp'

describe('parseInstant', () => {
  const iso = (input: string) => parseInstant(input).date.toISOString()

  it('detects the unit of numeric timestamps from their magnitude', () => {
    expect(parseInstant('1790856000')).toEqual({ date: new Date('2026-10-01T12:00:00Z'), interpretedAs: 'Unix seconds' })
    expect(parseInstant('1790856000000').interpretedAs).toBe('Unix milliseconds')
    expect(iso('1790856000000000')).toBe('2026-10-01T12:00:00.000Z')
    expect(iso('1790856000000000000')).toBe('2026-10-01T12:00:00.000Z')
  })

  it('handles fractional and negative seconds', () => {
    expect(iso('1790856000.5')).toBe('2026-10-01T12:00:00.500Z')
    expect(iso('-86400')).toBe('1969-12-31T00:00:00.000Z')
  })

  it('parses date strings', () => {
    expect(parseInstant(' 2026-10-01T14:00:00+02:00 ')).toEqual({ date: new Date('2026-10-01T12:00:00Z'), interpretedAs: 'Date string' })
  })

  it('rejects anything else', () => {
    expect(() => parseInstant('yesterday')).toThrow('Not a Unix timestamp')
  })
})

describe('formatIsoInZone', () => {
  const date = new Date('2026-10-01T12:00:00Z')

  it('formats with the zone offset at that instant', () => {
    expect(formatIsoInZone(date, 'Europe/Brussels')).toBe('2026-10-01T14:00:00.000+02:00')
    expect(formatIsoInZone(new Date('2026-12-01T12:00:00Z'), 'Europe/Brussels')).toBe('2026-12-01T13:00:00.000+01:00')
    expect(formatIsoInZone(date, 'Asia/Kolkata')).toBe('2026-10-01T17:30:00.000+05:30')
    expect(formatIsoInZone(date, 'UTC')).toBe('2026-10-01T12:00:00.000+00:00')
  })
})
