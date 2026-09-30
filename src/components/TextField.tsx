import { useId } from 'react'
import { CopyButton } from './CopyButton'
import styles from './TextField.module.css'

type Props = {
  label: string
  value: string
  onChange?: (value: string) => void
  error?: string
  placeholder?: string
  rows?: number
}

export function TextField({ label, value, onChange, error, placeholder, rows = 10 }: Props) {
  const id = useId()

  return (
    <div className={styles.field}>
      <div className={styles.header}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <CopyButton text={value} />
      </div>
      <textarea
        id={id}
        className={error ? `${styles.textarea} ${styles.invalid}` : styles.textarea}
        value={value}
        onChange={onChange && ((e) => onChange(e.target.value))}
        readOnly={!onChange}
        placeholder={placeholder}
        rows={rows}
        spellCheck={false}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}
