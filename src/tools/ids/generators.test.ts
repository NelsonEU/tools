import { describe, expect, it } from 'vitest'
import { generators } from './generators'

const generate = (name: string) => generators.find((g) => g.name === name)!.generate()

describe('ID generators', () => {
  it('produce the expected formats', () => {
    expect(generate('UUID v4')).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    expect(generate('UUID v7')).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    expect(generate('ULID')).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/)
    expect(generate('NanoID')).toMatch(/^[A-Za-z0-9_-]{21}$/)
  })

  it('makes time-ordered IDs sort in creation order', () => {
    for (const name of ['UUID v7', 'ULID']) {
      const ids = Array.from({ length: 50 }, () => generate(name))
      expect([...ids].sort()).toEqual(ids)
    }
  })
})
