import { describe, expect, it } from 'vitest'
import { matchLimit, runRegex, segments } from './regex'

describe('runRegex', () => {
  it('returns every match with numbered and named captures when global', () => {
    const { matches } = runRegex('(?<year>\\d{4})-(\\d{2})', 'g', 'from 2026-09 to 2027-01')
    expect(matches).toEqual([
      {
        index: 5,
        text: '2026-09',
        captures: [
          { name: '$1', value: '2026' },
          { name: '$2', value: '09' },
          { name: '<year>', value: '2026' },
        ],
      },
      {
        index: 16,
        text: '2027-01',
        captures: [
          { name: '$1', value: '2027' },
          { name: '$2', value: '01' },
          { name: '<year>', value: '2027' },
        ],
      },
    ])
  })

  it('returns only the first match without the g flag', () => {
    expect(runRegex('o', '', 'foo').matches).toHaveLength(1)
  })

  it('reports unmatched optional groups as undefined', () => {
    expect(runRegex('a(b)?', '', 'a').matches[0].captures).toEqual([{ name: '$1', value: undefined }])
  })

  it('terminates on zero-length matches', () => {
    expect(runRegex('x*', 'g', 'ab').matches).toHaveLength(3)
  })

  it('stops at the match limit', () => {
    const result = runRegex('.', 'g', 'a'.repeat(matchLimit + 5))
    expect(result.matches).toHaveLength(matchLimit)
    expect(result.truncated).toBe(true)
  })

  it('throws on an invalid pattern', () => {
    expect(() => runRegex('(', 'g', '')).toThrow(SyntaxError)
  })
})

describe('segments', () => {
  it('splits text into matched and unmatched parts, skipping empty matches', () => {
    const text = 'a1b22c'
    expect(segments(text, runRegex('\\d*', 'g', text).matches)).toEqual([
      { text: 'a', matched: false },
      { text: '1', matched: true },
      { text: 'b', matched: false },
      { text: '22', matched: true },
      { text: 'c', matched: false },
    ])
  })
})
