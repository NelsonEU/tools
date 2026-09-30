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

export function formatDate(date: Date, timeZone?: string): string {
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long', timeZone }).format(date)
}

export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])
  return now
}

// Some browsers omit UTC from the supported list
export const timeZones = ['UTC', ...Intl.supportedValuesOf('timeZone').filter((z) => z !== 'UTC')]

export const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
