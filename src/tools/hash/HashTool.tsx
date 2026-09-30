import { useState } from 'react'
import { TextField } from '../../components/TextField'
import { ValueList } from '../../components/ValueList'
import { algorithms } from './hashes'

export default function HashTool() {
  const [text, setText] = useState('')

  return (
    <>
      <TextField label="Text" value={text} onChange={setText} placeholder="Text to hash" rows={6} />
      <ValueList rows={algorithms.map((a) => ({ label: a.name, value: a.hash(text) }))} />
    </>
  )
}
