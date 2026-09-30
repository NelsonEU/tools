export type Capture = {
  name: string
  value: string | undefined
}

export type RegexMatch = {
  index: number
  text: string
  captures: Capture[]
}

export type RegexResult = {
  matches: RegexMatch[]
  truncated: boolean
}

export type Segment = {
  text: string
  matched: boolean
}

export const matchLimit = 1000

function toMatch(m: RegExpExecArray): RegexMatch {
  const numbered = m.slice(1).map((value, i) => ({ name: `$${i + 1}`, value }))
  const named = Object.entries(m.groups ?? {}).map(([name, value]) => ({ name: `<${name}>`, value }))
  return { index: m.index, text: m[0], captures: [...numbered, ...named] }
}

// Throws a SyntaxError for an invalid pattern or flags
export function runRegex(pattern: string, flags: string, text: string): RegexResult {
  const regex = new RegExp(pattern, flags)
  if (!regex.global) {
    const m = regex.exec(text)
    return { matches: m ? [toMatch(m)] : [], truncated: false }
  }
  const matches: RegexMatch[] = []
  for (const m of text.matchAll(regex)) {
    if (matches.length === matchLimit) return { matches, truncated: true }
    matches.push(toMatch(m))
  }
  return { matches, truncated: false }
}

export function segments(text: string, matches: RegexMatch[]): Segment[] {
  const result: Segment[] = []
  let position = 0
  for (const { index, text: matchText } of matches) {
    if (!matchText) continue
    if (index > position) result.push({ text: text.slice(position, index), matched: false })
    result.push({ text: matchText, matched: true })
    position = index + matchText.length
  }
  if (position < text.length) result.push({ text: text.slice(position), matched: false })
  return result
}
