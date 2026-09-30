import * as TOML from 'smol-toml'
import YAML from 'yaml'

export type Format = {
  name: string
  parse: (text: string) => unknown
  stringify: (value: unknown) => string
}

function parseJson(text: string): unknown {
  // Integers beyond 2^53 become BigInt so they survive conversion exactly
  return JSON.parse(text, (_key, value, context) =>
    typeof value === 'number' && !Number.isSafeInteger(value) && /^-?\d+$/.test(context.source ?? '')
      ? BigInt(context.source!)
      : value,
  )
}

function stringifyJson(value: unknown): string {
  const { rawJSON } = JSON
  return JSON.stringify(
    value,
    (_key, v) => (typeof v === 'bigint' ? (rawJSON ? rawJSON(String(v)) : Number(v)) : v),
    2,
  )
}

function parseYaml(text: string): unknown {
  try {
    return YAML.parse(text, { intAsBigInt: true })
  } catch (e) {
    const message = (e as Error).message
    throw new Error(message.includes('multiple documents') ? 'Only single-document YAML is supported (found ---)' : message)
  }
}

function findNull(value: unknown, path: string): string | undefined {
  if (value === null) return path || '(root)'
  if (typeof value !== 'object' || value instanceof Date) return undefined
  for (const [key, child] of Object.entries(value)) {
    const found = findNull(child, Array.isArray(value) ? `${path}[${key}]` : path ? `${path}.${key}` : key)
    if (found) return found
  }
  return undefined
}

function stringifyToml(value: unknown): string {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('TOML needs an object at the top level')
  }
  const nullPath = findNull(value, '')
  if (nullPath) throw new Error(`TOML has no null value, found one at ${nullPath}`)
  return TOML.stringify(value)
}

const firstLine = (fn: (text: string) => unknown) => (text: string) => {
  try {
    return fn(text)
  } catch (e) {
    throw new Error((e as Error).message.split('\n')[0].replace(/:$/, ''))
  }
}

export const formats: Format[] = [
  { name: 'JSON', parse: firstLine(parseJson), stringify: stringifyJson },
  { name: 'YAML', parse: firstLine(parseYaml), stringify: (value) => YAML.stringify(value) },
  { name: 'TOML', parse: firstLine((text) => TOML.parse(text, { integersAsBigInt: 'asNeeded' })), stringify: stringifyToml },
]

export function convert(text: string, from: Format, to: Format): string {
  return to.stringify(from.parse(text))
}
