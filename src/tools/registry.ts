import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

export type Tool = {
  path: string
  name: string
  category: string
  description: string
  icon: string
  component: LazyExoticComponent<ComponentType>
}

export const tools: Tool[] = [
  {
    path: 'encode',
    name: 'Base64 / URL / HTML',
    category: 'Encoding',
    description: 'Base64, URL percent-encoding and HTML entities. Type in either side, the other updates.',
    icon: 'b64',
    component: lazy(() => import('./encode/EncodeTool')),
  },
  {
    path: 'jwt',
    name: 'JWT decoder',
    category: 'Encoding',
    description: 'Header and payload decoded, expiry in human time. The signature is not verified.',
    icon: 'jwt',
    component: lazy(() => import('./jwt/JwtTool')),
  },
  {
    path: 'hash',
    name: 'Hash generator',
    category: 'Encoding',
    description: 'MD5, SHA-1 and SHA-256 of any text, as hex.',
    icon: '#',
    component: lazy(() => import('./hash/HashTool')),
  },
  {
    path: 'json',
    name: 'JSON formatter',
    category: 'Data',
    description: 'Validate, pretty-print or minify. Numbers are kept exactly as written.',
    icon: '{}',
    component: lazy(() => import('./json/JsonTool')),
  },
  {
    path: 'convert',
    name: 'JSON / YAML / TOML',
    category: 'Data',
    description: 'Convert between JSON, YAML and TOML. Large integers stay exact; comments are not carried over.',
    icon: 'yml',
    component: lazy(() => import('./convert/ConvertTool')),
  },
  {
    path: 'regex',
    name: 'Regex tester',
    category: 'Text',
    description: 'JavaScript regex with match highlighting and capture groups. Runaway patterns are stopped after 1 second.',
    icon: '.*',
    component: lazy(() => import('./regex/RegexTool')),
  },
  {
    path: 'ids',
    name: 'ID generator',
    category: 'Generators',
    description: 'UUID v4 and v7, ULID and NanoID, one or hundreds at a time.',
    icon: 'id',
    component: lazy(() => import('./ids/IdTool')),
  },
  {
    path: 'timestamp',
    name: 'Timestamp converter',
    category: 'Time',
    description: 'Unix timestamps to dates and back, in any time zone. The unit is detected from the size.',
    icon: 'ts',
    component: lazy(() => import('./timestamp/TimestampTool')),
  },
  {
    path: 'cron',
    name: 'Cron explainer',
    category: 'Time',
    description: 'Cron expressions in plain English, with the next runs in your time zone.',
    icon: '*/5',
    component: lazy(() => import('./cron/CronTool')),
  },
]

export const categories = [...new Set(tools.map((t) => t.category))]
