import type { ComponentType, LazyExoticComponent } from 'react'

export type Tool = {
  path: string
  name: string
  category: string
  component: LazyExoticComponent<ComponentType>
}

export const tools: Tool[] = []
