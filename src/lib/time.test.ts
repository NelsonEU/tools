import { describe, expect, it } from 'vitest'
import { formatRelative } from './time'

describe('formatRelative', () => {
  const now = new Date('2026-09-30T12:00:00Z')
  const at = (iso: string) => formatRelative(new Date(iso), now)

  it('picks the largest fitting unit', () => {
    expect(at('2026-09-30T15:00:00Z')).toBe('in 3 hours')
    expect(at('2026-09-28T12:00:00Z')).toBe('2 days ago')
    expect(at('2026-09-30T12:00:45Z')).toBe('in 45 seconds')
  })

  it('says now for the same instant', () => {
    expect(at('2026-09-30T12:00:00Z')).toBe('now')
  })
})
