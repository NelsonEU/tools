import { useMemo, useState } from 'react'
import { Checkbox } from '../../components/Checkbox'
import { Panes } from '../../components/Panes'
import { SegmentedControl } from '../../components/SegmentedControl'
import { TextField } from '../../components/TextField'
import { formatJson, indents, type Indent } from './format'
import styles from './JsonTool.module.css'

export default function JsonTool() {
  const [input, setInput] = useState('')
  const [indent, setIndent] = useState<Indent>('2 spaces')
  const [sorted, setSorted] = useState(false)

  const result = useMemo((): { output: string; error?: string } => {
    if (!input.trim()) return { output: '' }
    try {
      return { output: formatJson(input, indent, sorted) }
    } catch (e) {
      return { output: '', error: (e as Error).message }
    }
  }, [input, indent, sorted])

  return (
    <>
      <div className={styles.options}>
        <SegmentedControl label="Indentation" options={indents} value={indent} onChange={(v) => setIndent(v as Indent)} />
        <Checkbox label="Sort keys" checked={sorted} onChange={setSorted} />
      </div>
      <Panes>
        <TextField label="Input" value={input} onChange={setInput} error={result.error} placeholder='{"paste": "JSON here"}' rows={20} />
        <TextField label="Output" value={result.output} rows={20} />
      </Panes>
    </>
  )
}
