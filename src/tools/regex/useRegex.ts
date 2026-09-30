import { useEffect, useState } from 'react'
import type { RegexResult } from './regex'

export type RegexRequest = {
  pattern: string
  flags: string
  text: string
}

export type RegexResponse = {
  result?: RegexResult
  error?: string
}

// The text a result was computed on, which lags the input while a run is in flight
export type RegexState = RegexResponse & { text: string }

const timeoutMs = 1000

// Runs in a worker so a catastrophically backtracking pattern can be killed instead of freezing the tab
export function useRegex(pattern: string, flags: string, text: string): RegexState {
  const [state, setState] = useState<RegexState>({ text: '' })

  useEffect(() => {
    if (!pattern) return
    const worker = new Worker(new URL('./regex.worker.ts', import.meta.url), { type: 'module' })
    const timer = setTimeout(() => {
      worker.terminate()
      setState({ text, error: `Stopped after ${timeoutMs / 1000}s, the pattern is likely backtracking catastrophically` })
    }, timeoutMs)
    worker.onmessage = (e: MessageEvent<RegexResponse>) => {
      clearTimeout(timer)
      worker.terminate()
      setState({ ...e.data, text })
    }
    worker.postMessage({ pattern, flags, text } satisfies RegexRequest)
    return () => {
      clearTimeout(timer)
      worker.terminate()
    }
  }, [pattern, flags, text])

  return pattern ? state : { text }
}
