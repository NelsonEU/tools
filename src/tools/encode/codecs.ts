import { decodeHTML, escapeUTF8 } from 'entities'

export type Codec = {
  name: string
  encode: (text: string) => string
  decode: (text: string) => string
}

const utf8Decoder = new TextDecoder('utf-8', { fatal: true })

function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  return btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(''))
}

function decodeBase64(text: string): string {
  // Accept URL-safe alphabet and missing padding too
  const normalized = text.replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  let binary: string
  try {
    binary = atob(padded)
  } catch {
    throw new Error('Not valid Base64')
  }
  try {
    return utf8Decoder.decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)))
  } catch {
    throw new Error('Decoded bytes are not valid UTF-8 text')
  }
}

function decodeUrl(text: string): string {
  try {
    return decodeURIComponent(text)
  } catch {
    throw new Error('Malformed percent-encoding')
  }
}

export const codecs: Codec[] = [
  { name: 'Base64', encode: encodeBase64, decode: decodeBase64 },
  { name: 'URL', encode: encodeURIComponent, decode: decodeUrl },
  { name: 'HTML entities', encode: escapeUTF8, decode: decodeHTML },
]
