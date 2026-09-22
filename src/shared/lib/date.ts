// Dates as "YYYY-MM-DD" strings: the backend's DATE format, free of time-zone shifts.
const pad = (n: number) => String(n).padStart(2, '0')

export const toIsoDate = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`

export function parseIsoDate(value: string | null | undefined) {
  const m = value ? /^(\d{4})-(\d{2})-(\d{2})/.exec(value) : null
  return m ? { y: Number(m[1]), m: Number(m[2]) - 1, d: Number(m[3]) } : null
}
