import { describe, expect, it } from 'vitest'
import { algorithms } from './hashes'

const hash = (name: string, text: string) => algorithms.find((a) => a.name === name)!.hash(text)

describe('hashes', () => {
  it('matches known digests of the empty string', () => {
    expect(hash('MD5', '')).toBe('d41d8cd98f00b204e9800998ecf8427e')
    expect(hash('SHA-1', '')).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709')
    expect(hash('SHA-256', '')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
  })

  it('hashes the UTF-8 bytes of the text', () => {
    expect(hash('MD5', 'café')).toBe('07117fe4a1ebd544965dc19573183da2')
  })
})
