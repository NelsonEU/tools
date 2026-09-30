export type Indent = '2 spaces' | '4 spaces' | 'Tab' | 'Minified'

export const indents: Indent[] = ['2 spaces', '4 spaces', 'Tab', 'Minified']

const indentValues: Record<Indent, string | number> = { '2 spaces': 2, '4 spaces': 4, Tab: '\t', Minified: 0 }

// Keeps numbers as written, so large IDs and 1.50 are not altered by float conversion
export function parseJson(text: string): unknown {
  const { rawJSON } = JSON
  if (!rawJSON) return JSON.parse(text)
  return JSON.parse(text, (_key, value, context) =>
    typeof value === 'number' && context.source !== undefined ? rawJSON(context.source) : value,
  )
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys)
  if (typeof value !== 'object' || value === null || JSON.isRawJSON?.(value)) return value
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, sortKeys((value as Record<string, unknown>)[key])]),
  )
}

export function formatJson(text: string, indent: Indent, sorted: boolean): string {
  const value = parseJson(text)
  return JSON.stringify(sorted ? sortKeys(value) : value, null, indentValues[indent])
}
