import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

export type Tool = {
  path: string
  name: string
  category: string
  component: LazyExoticComponent<ComponentType>
}

export const tools: Tool[] = [
  { path: 'encode', name: 'Base64 / URL / HTML', category: 'Encoding', component: lazy(() => import('./encode/EncodeTool')) },
  { path: 'jwt', name: 'JWT decoder', category: 'Encoding', component: lazy(() => import('./jwt/JwtTool')) },
  { path: 'hash', name: 'Hash generator', category: 'Encoding', component: lazy(() => import('./hash/HashTool')) },
  { path: 'ids', name: 'ID generator', category: 'Generators', component: lazy(() => import('./ids/IdTool')) },
  { path: 'timestamp', name: 'Timestamp converter', category: 'Time', component: lazy(() => import('./timestamp/TimestampTool')) },
  { path: 'cron', name: 'Cron explainer', category: 'Time', component: lazy(() => import('./cron/CronTool')) },
  { path: 'json', name: 'JSON formatter', category: 'Data', component: lazy(() => import('./json/JsonTool')) },
  { path: 'regex', name: 'Regex tester', category: 'Text', component: lazy(() => import('./regex/RegexTool')) },
]
