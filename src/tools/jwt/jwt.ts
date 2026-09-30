import { decodeBase64 } from '../../lib/base64'

type JsonObject = Record<string, unknown>

export type DecodedJwt = {
  header: JsonObject
  payload: JsonObject
  signature: string
}

export type TimeClaim = {
  claim: string
  label: string
  date: Date
}

export type TokenStatus = 'Valid' | 'Expired' | 'Not yet valid' | 'No expiry'

function decodePart(part: string, name: string): JsonObject {
  let json: unknown
  try {
    json = JSON.parse(decodeBase64(part))
  } catch {
    throw new Error(`${name} is not Base64URL-encoded JSON`)
  }
  if (typeof json !== 'object' || json === null || Array.isArray(json)) {
    throw new Error(`${name} is not a JSON object`)
  }
  return json as JsonObject
}

export function decodeJwt(input: string): DecodedJwt {
  const token = input.trim().replace(/^Bearer\s+/i, '')
  const parts = token.split('.')
  if (parts.length === 5) throw new Error('This is an encrypted token (JWE), it cannot be decoded without the key')
  if (parts.length !== 3) throw new Error(`A JWT has 3 dot-separated parts, this has ${parts.length}`)
  return {
    header: decodePart(parts[0], 'Header'),
    payload: decodePart(parts[1], 'Payload'),
    signature: parts[2],
  }
}

const timeClaimLabels: [string, string][] = [
  ['iat', 'Issued at'],
  ['nbf', 'Not before'],
  ['exp', 'Expires'],
]

export function timeClaims(payload: JsonObject): TimeClaim[] {
  return timeClaimLabels
    .filter(([claim]) => typeof payload[claim] === 'number')
    .map(([claim, label]) => ({ claim, label, date: new Date((payload[claim] as number) * 1000) }))
}

export function tokenStatus(payload: JsonObject, now: Date): TokenStatus {
  const seconds = now.getTime() / 1000
  if (typeof payload.nbf === 'number' && payload.nbf > seconds) return 'Not yet valid'
  if (typeof payload.exp !== 'number') return 'No expiry'
  return payload.exp <= seconds ? 'Expired' : 'Valid'
}
