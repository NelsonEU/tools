const utf8Decoder = new TextDecoder('utf-8', { fatal: true })

export function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  return btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(''))
}

// Accepts the URL-safe alphabet, missing padding and whitespace
export function decodeBase64(text: string): string {
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
