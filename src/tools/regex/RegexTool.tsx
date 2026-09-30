import { useState } from 'react'
import { Checkbox } from '../../components/Checkbox'
import { Field } from '../../components/Field'
import { TextField } from '../../components/TextField'
import { ToolPage } from '../../components/ToolPage'
import { matchLimit, segments } from './regex'
import styles from './RegexTool.module.css'
import { useRegex } from './useRegex'

const flagOptions = [
  { flag: 'g', label: 'global' },
  { flag: 'i', label: 'ignore case' },
  { flag: 'm', label: 'multiline' },
  { flag: 's', label: 'dot matches newline' },
  { flag: 'u', label: 'unicode' },
]

export default function RegexTool() {
  const [pattern, setPattern] = useState('(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})')
  const [flags, setFlags] = useState('g')
  const [text, setText] = useState('Released 2026-09-30, patched 2026-10-01.')
  const { result, error, text: matchedText } = useRegex(pattern, flags, text)

  function toggleFlag(flag: string, on: boolean) {
    setFlags(flagOptions.map((o) => o.flag).filter((f) => (f === flag ? on : flags.includes(f))).join(''))
  }

  const count = result?.matches.length ?? 0

  return (
    <ToolPage
      title="Regex tester"
      description="JavaScript regular expressions with match highlighting and capture groups. Runs in a background thread and stops runaway patterns after 1 second."
    >
      <Field id="regex-pattern" label="Pattern" error={error}>
        <div className={styles.pattern}>
          <span className={styles.slash}>/</span>
          <input
            id="regex-pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            spellCheck={false}
            aria-invalid={!!error}
          />
          <span className={styles.slash}>/{flags}</span>
        </div>
      </Field>
      <div className={styles.flags}>
        {flagOptions.map(({ flag, label }) => (
          <Checkbox key={flag} label={`${flag} (${label})`} checked={flags.includes(flag)} onChange={(on) => toggleFlag(flag, on)} />
        ))}
      </div>
      <TextField label="Test text" value={text} onChange={setText} rows={8} />
      {result && (
        <>
          <p className={styles.summary}>
            {count === 0 ? 'No match' : `${count}${result.truncated ? '+' : ''} match${count === 1 ? '' : 'es'}`}
            {result.truncated && ` (showing the first ${matchLimit})`}
          </p>
          {count > 0 && (
            <>
              <pre className={styles.preview}>
                {segments(matchedText, result.matches).map((s, i) => (s.matched ? <mark key={i}>{s.text}</mark> : s.text))}
              </pre>
              <table className={styles.matches}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Index</th>
                    <th>Match</th>
                    <th>Groups</th>
                  </tr>
                </thead>
                <tbody>
                  {result.matches.map((m, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{m.index}</td>
                      <td>
                        <code>{m.text}</code>
                      </td>
                      <td>
                        {m.captures.map((c) => (
                          <div key={c.name}>
                            <span className={styles.groupName}>{c.name}</span>{' '}
                            {c.value === undefined ? <span className={styles.unmatched}>unmatched</span> : <code>{c.value}</code>}
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </ToolPage>
  )
}
