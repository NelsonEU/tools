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
]
