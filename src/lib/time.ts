import { useEffect, useState } from 'react'

const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
  ['second', 1],
]

const relativeFormat = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export function formatRelative(date: Date, now: Date): string {
  const seconds = (date.getTime() - now.getTime()) / 1000
  const [unit, size] = units.find(([, size]) => Math.abs(seconds) >= size) ?? units[units.length - 1]
  return relativeFormat.format(Math.round(seconds / size), unit)
}

const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'long' })

export function formatDate(date: Date): string {
  return dateFormat.format(date)
}

export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])
  return now
}
