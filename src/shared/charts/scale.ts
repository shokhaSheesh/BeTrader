import { MONTHS_SHORT } from '@/shared/i18n'
import { useUiStore } from '@/shared/lib/ui-store'
// Small scale helpers for the SVG charts (no chart library: marks follow DESIGN.md §5 "Charts" exactly).

/** Round a max up to a clean number and return evenly spaced ticks from `min`. */
export function niceTicks(min: number, max: number, count = 4) {
  const span = Math.max(max - min, 1e-9)
  const raw = span / count
  const pow = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? raw
  const lo = Math.floor(min / step) * step
  const hi = Math.ceil(max / step) * step
  const ticks: number[] = []
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Number(v.toFixed(10)))
  return { ticks, lo, hi }
}

/** 12 400 → "12.4K", 1 250 000 → "1.25M", 4 800 000 000 → "4.8B" (axis ticks only; values elsewhere use format.ts). */
export function compact(value: number) {
  const abs = Math.abs(value)
  const [k, m, b] =
    useUiStore.getState().language === 'ru'
      ? ['\u00a0тыс', '\u00a0млн', '\u00a0млрд']
      : ['K', 'M', 'B']
  if (abs >= 1e9) return `${Number((value / 1e9).toFixed(2))}${b}`
  if (abs >= 1e6) return `${Number((value / 1e6).toFixed(2))}${m}`
  if (abs >= 1e3) return `${Number((value / 1e3).toFixed(1))}${k}`
  return String(Number(value.toFixed(2)))
}

export const monthLabel = (iso: string) =>
  `${MONTHS_SHORT[useUiStore.getState().language][Number(iso.slice(5, 7)) - 1]} ’${iso.slice(2, 4)}`
