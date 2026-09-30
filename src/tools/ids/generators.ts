import { nanoid } from 'nanoid'
import { monotonicFactory } from 'ulid'
import { v4, v7 } from 'uuid'

const ulid = monotonicFactory()

export type IdGenerator = {
  name: string
  generate: () => string
}

export const generators: IdGenerator[] = [
  { name: 'UUID v4', generate: () => v4() },
  { name: 'UUID v7', generate: () => v7() },
  { name: 'ULID', generate: () => ulid() },
  { name: 'NanoID', generate: () => nanoid() },
]
