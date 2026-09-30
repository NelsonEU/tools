import { useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { Panes } from '../../components/Panes'
import { SegmentedControl } from '../../components/SegmentedControl'
import { TextField } from '../../components/TextField'
import styles from './ConvertTool.module.css'
import { convert, formats } from './formats'

const names = formats.map((f) => f.name)
const byName = (name: string) => formats.find((f) => f.name === name)!

export default function ConvertTool() {
  const [from, setFrom] = useState(formats[0])
  const [to, setTo] = useState(formats[1])
  const [input, setInput] = useState('')

  const result = useMemo((): { output: string; error?: string } => {
    if (!input.trim()) return { output: '' }
    try {
      return { output: convert(input, from, to) }
    } catch (e) {
      return { output: '', error: (e as Error).message }
    }
  }, [input, from, to])

  function swap() {
    setFrom(to)
    setTo(from)
    if (!result.error) setInput(result.output)
  }

  return (
    <>
      <div className={styles.controls}>
        <div className={styles.control}>
          <span className={styles.label}>From</span>
          <SegmentedControl label="From" options={names} value={from.name} onChange={(n) => setFrom(byName(n))} />
        </div>
        <Button onClick={swap} aria-label="Swap formats" className={styles.swap}>
          ⇄
        </Button>
        <div className={styles.control}>
          <span className={styles.label}>To</span>
          <SegmentedControl label="To" options={names} value={to.name} onChange={(n) => setTo(byName(n))} />
        </div>
      </div>
      <Panes>
        <TextField label={from.name} value={input} onChange={setInput} error={result.error} placeholder={`Paste ${from.name} here`} rows={20} />
        <TextField label={to.name} value={result.output} rows={20} />
      </Panes>
    </>
  )
}
