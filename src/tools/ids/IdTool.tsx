import { useState } from 'react'
import { Button } from '../../components/Button'
import { SegmentedControl } from '../../components/SegmentedControl'
import { TextField } from '../../components/TextField'
import { ToolPage } from '../../components/ToolPage'
import { generators, type IdGenerator } from './generators'
import styles from './IdTool.module.css'

const maxCount = 500

const generateMany = (generator: IdGenerator, count: number) => Array.from({ length: count }, () => generator.generate())

export default function IdTool() {
  const [generator, setGenerator] = useState(generators[0])
  const [count, setCount] = useState(10)
  const [ids, setIds] = useState(() => generateMany(generator, count))

  function changeGenerator(name: string) {
    const next = generators.find((g) => g.name === name)!
    setGenerator(next)
    setIds(generateMany(next, count))
  }

  function changeCount(value: number) {
    const next = Math.min(Math.max(Math.trunc(value) || 1, 1), maxCount)
    setCount(next)
    setIds(generateMany(generator, next))
  }

  return (
    <ToolPage
      title="ID generator"
      description="UUID v4 (random), UUID v7 and ULID (time-ordered, sort by creation), NanoID (short, URL-safe)."
    >
      <SegmentedControl label="ID type" options={generators.map((g) => g.name)} value={generator.name} onChange={changeGenerator} />
      <div className={styles.controls}>
        <label htmlFor="id-count">Count</label>
        <input
          id="id-count"
          type="number"
          min={1}
          max={maxCount}
          value={count}
          onChange={(e) => changeCount(e.target.valueAsNumber)}
          className={styles.count}
        />
        <Button onClick={() => setIds(generateMany(generator, count))}>Regenerate</Button>
      </div>
      <TextField label={generator.name} value={ids.join('\n')} rows={Math.min(count, 20)} />
    </ToolPage>
  )
}
