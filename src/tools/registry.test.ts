import { describe, expect, it } from 'vitest'
import { tools } from './registry'

describe('tool registry', () => {
  it('has unique paths', () => {
    const paths = tools.map((t) => t.path)
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('uses URL-safe paths', () => {
    for (const t of tools) expect(t.path).toMatch(/^[a-z0-9-]+$/)
  })
})
