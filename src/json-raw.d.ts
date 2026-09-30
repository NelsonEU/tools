// JSON.parse source text access (ES2025), not yet in TypeScript's lib
interface JSON {
  rawJSON?: (text: string) => object
  isRawJSON?: (value: unknown) => boolean
  parse(text: string, reviver: (key: string, value: unknown, context: { source?: string }) => unknown): unknown
}
