import { describe, expect, it } from 'vitest'
import { decodeJwt, timeClaims, tokenStatus } from './jwt'

const sample =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

describe('decodeJwt', () => {
  it('decodes header, payload and keeps the signature', () => {
    expect(decodeJwt(sample)).toEqual({
      header: { alg: 'HS256', typ: 'JWT' },
      payload: { sub: '1234567890', name: 'John Doe', iat: 1516239022 },
      signature: 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    })
  })

  it('strips a Bearer prefix and surrounding whitespace', () => {
    expect(decodeJwt(`  Bearer ${sample}\n`).header.alg).toBe('HS256')
  })

  it('explains what is wrong', () => {
    expect(() => decodeJwt('abc.def')).toThrow('this has 2')
    expect(() => decodeJwt('a.b.c.d.e')).toThrow('JWE')
    expect(() => decodeJwt('not-json.e30.x')).toThrow('Header is not Base64URL-encoded JSON')
    expect(() => decodeJwt('e30.WzFd.x')).toThrow('Payload is not a JSON object')
  })
})

describe('time claims', () => {
  const now = new Date('2026-09-30T12:00:00Z')
  const nowSeconds = now.getTime() / 1000

  it('lists numeric time claims as dates', () => {
    expect(timeClaims({ iat: 1516239022, exp: 'soon', sub: 'x' })).toEqual([
      { claim: 'iat', label: 'Issued at', date: new Date(1516239022000) },
    ])
  })

  it('derives the token status', () => {
    expect(tokenStatus({ exp: nowSeconds + 60 }, now)).toBe('Valid')
    expect(tokenStatus({ exp: nowSeconds - 60 }, now)).toBe('Expired')
    expect(tokenStatus({ nbf: nowSeconds + 60, exp: nowSeconds + 120 }, now)).toBe('Not yet valid')
    expect(tokenStatus({}, now)).toBe('No expiry')
  })
})
