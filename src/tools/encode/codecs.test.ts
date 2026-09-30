import { describe, expect, it } from 'vitest'
import { codecs } from './codecs'

const codec = (name: string) => codecs.find((c) => c.name === name)!

describe('Base64', () => {
  const { encode, decode } = codec('Base64')

  it('round-trips UTF-8 text', () => {
    for (const text of ['hello', 'café', '😀 emoji', '']) expect(decode(encode(text))).toBe(text)
  })

  it('encodes UTF-8 bytes, not UTF-16 code units', () => {
    expect(encode('é')).toBe('w6k=')
  })

  it('accepts URL-safe alphabet, missing padding and whitespace', () => {
    expect(decode('fn5-')).toBe('~~~')
    expect(decode('Pz8_')).toBe('???')
    expect(decode('aGVs\nbG8')).toBe('hello')
  })

  it('rejects invalid input', () => {
    expect(() => decode('a$b')).toThrow('Not valid Base64')
    expect(() => decode('/w==')).toThrow('not valid UTF-8')
  })
})

describe('URL', () => {
  const { encode, decode } = codec('URL')

  it('round-trips reserved and non-ASCII characters', () => {
    const text = 'a b&c=d/é?#'
    expect(encode(text)).toBe('a%20b%26c%3Dd%2F%C3%A9%3F%23')
    expect(decode(encode(text))).toBe(text)
  })

  it('rejects malformed percent-encoding', () => {
    expect(() => decode('%E0%A4%A')).toThrow('Malformed percent-encoding')
  })
})

describe('HTML entities', () => {
  const { encode, decode } = codec('HTML entities')

  it('escapes markup characters and leaves other text alone', () => {
    expect(encode('<a href="x">café & \'q\'</a>')).toBe('&lt;a href=&quot;x&quot;&gt;café &amp; &apos;q&apos;&lt;/a&gt;')
  })

  it('decodes named and numeric entities', () => {
    expect(decode('&lt;p&gt;caf&eacute; &#x1F600; &#169;')).toBe('<p>café 😀 ©')
  })
})
