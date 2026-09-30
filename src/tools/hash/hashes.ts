import { md5, sha1 } from '@noble/hashes/legacy.js'
import { sha256 } from '@noble/hashes/sha2.js'
import { bytesToHex, utf8ToBytes } from '@noble/hashes/utils.js'

export type HashAlgorithm = {
  name: string
  hash: (text: string) => string
}

export const algorithms: HashAlgorithm[] = [
  { name: 'MD5', hash: (text) => bytesToHex(md5(utf8ToBytes(text))) },
  { name: 'SHA-1', hash: (text) => bytesToHex(sha1(utf8ToBytes(text))) },
  { name: 'SHA-256', hash: (text) => bytesToHex(sha256(utf8ToBytes(text))) },
]
