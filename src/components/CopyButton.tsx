import { useEffect, useState } from 'react'
import styles from './CopyButton.module.css'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timer)
  }, [copied])

  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
  }

  return (
    <button type="button" className={styles.button} onClick={copy} disabled={!text}>
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
