import styles from './SegmentedControl.module.css'

type Props = {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

export function SegmentedControl({ label, options, value, onChange }: Props) {
  return (
    <div role="radiogroup" aria-label={label} className={styles.group}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={option === value}
          className={option === value ? `${styles.option} ${styles.selected}` : styles.option}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
