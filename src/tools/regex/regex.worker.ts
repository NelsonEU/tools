import { runRegex } from './regex'
import type { RegexRequest, RegexResponse } from './useRegex'

self.onmessage = (e: MessageEvent<RegexRequest>) => {
  const { pattern, flags, text } = e.data
  let response: RegexResponse
  try {
    response = { result: runRegex(pattern, flags, text) }
  } catch (err) {
    response = { error: (err as Error).message }
  }
  self.postMessage(response)
}
