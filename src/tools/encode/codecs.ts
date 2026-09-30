import { decodeHTML, escapeUTF8 } from 'entities'
import { decodeBase64, encodeBase64 } from '../../lib/base64'

export type Codec = {
  name: string
  encode: (text: string) => string
  decode: (text: string) => string
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
