import { useState } from 'react'
import { SegmentedControl } from '../../components/SegmentedControl'
import { TextField } from '../../components/TextField'
import { ToolPage } from '../../components/ToolPage'
import { codecs } from './codecs'
import styles from './EncodeTool.module.css'

export default function EncodeTool() {
  const [codec, setCodec] = useState(codecs[0])
  const [plain, setPlain] = useState('')
  const [encoded, setEncoded] = useState('')
  const [error, setError] = useState<string>()

  function changeCodec(name: string) {
    const next = codecs.find((c) => c.name === name)!
    setCodec(next)
    setEncoded(next.encode(plain))
    setError(undefined)
  }

  function changePlain(value: string) {
    setPlain(value)
    setEncoded(codec.encode(value))
    setError(undefined)
  }

  function changeEncoded(value: string) {
    setEncoded(value)
    try {
      setPlain(codec.decode(value))
      setError(undefined)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <ToolPage
      title="Encode / decode"
      description="Base64, URL percent-encoding and HTML entities. Type in either side, the other updates."
    >
      <SegmentedControl label="Encoding" options={codecs.map((c) => c.name)} value={codec.name} onChange={changeCodec} />
      <div className={styles.panes}>
        <TextField label="Text" value={plain} onChange={changePlain} placeholder="Plain text" />
        <TextField label={codec.name} value={encoded} onChange={changeEncoded} error={error} placeholder="Encoded" />
      </div>
    </ToolPage>
  )
}
