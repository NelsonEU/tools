import { timeZones } from '../lib/time'

type Props = {
  id: string
  value: string
  onChange: (zone: string) => void
}

export function TimeZoneSelect({ id, value, onChange }: Props) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
      {timeZones.map((z) => (
        <option key={z}>{z}</option>
      ))}
    </select>
  )
}
