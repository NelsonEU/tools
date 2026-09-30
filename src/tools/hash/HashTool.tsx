import { useState } from 'react'
import { TextField } from '../../components/TextField'
import { ToolPage } from '../../components/ToolPage'
import { ValueList } from '../../components/ValueList'
import { algorithms } from './hashes'

export default function HashTool() {
  const [text, setText] = useState('')

  return (
    <ToolPage title="Hash generator" description="MD5, SHA-1 and SHA-256 of the UTF-8 text, as hex.">
      <TextField label="Text" value={text} onChange={setText} placeholder="Text to hash" rows={6} />
      <ValueList rows={algorithms.map((a) => ({ label: a.name, value: a.hash(text) }))} />
    </ToolPage>
  )
}
