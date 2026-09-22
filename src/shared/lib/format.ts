// Number formatting follows the BeTrader app: space for thousands, dot for decimals,
// "UZS" after the amount, "$" before it. See docs/DESIGN.md §2.
const NBSP = ' '
const MINUS = '−'

export type Currency = 'UZS' | 'USD'

function groupDigits(value: number, fractionDigits: { min: number; max: number }) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: fractionDigits.min,
    maximumFractionDigits: fractionDigits.max,
  })
    .format(value)
    .replace(/,/g, NBSP)
}

/** 1250000 → "1 250 000 UZS", 210.08 → "$210.08". Always unsigned; use formatSignedMoney for direction. */
export function formatMoney(amount: number, currency: Currency = 'UZS') {
  const abs = Math.abs(amount)
  if (currency === 'USD') return `$${groupDigits(abs, { min: 2, max: 2 })}`
  return `${groupDigits(abs, { min: 0, max: 2 })}${NBSP}UZS`
}

/** Inflow → "+ 390 000 UZS", outflow → "− 390 000 UZS" (real minus sign, U+2212). */
export function formatSignedMoney(amount: number, currency: Currency = 'UZS') {
  if (amount === 0) return formatMoney(0, currency)
  return `${amount > 0 ? '+' : MINUS}${NBSP}${formatMoney(amount, currency)}`
}

/** 10697 → "10 697" */
export function formatNumber(value: number, maxFractionDigits = 2) {
  const formatted = groupDigits(Math.abs(value), { min: 0, max: maxFractionDigits })
  return value < 0 ? `${MINUS}${formatted}` : formatted
}

/** 1250000 → "1 250 000.00". For amounts whose currency the backend doesn't state (DESIGN.md §0). */
export function formatAmount(value: number) {
  const formatted = groupDigits(Math.abs(value), { min: 2, max: 2 })
  return value < 0 ? `${MINUS}${formatted}` : formatted
}

/** "+998901234567" → "+998 90 123 45 67". Other formats are returned unchanged. */
export function formatPhone(phone: string) {
  const m = /^\+?998(\d{2})(\d{3})(\d{2})(\d{2})$/.exec(phone.replace(/\s/g, ''))
  return m ? `+998${NBSP}${m[1]}${NBSP}${m[2]}${NBSP}${m[3]}${NBSP}${m[4]}` : phone
}

const pad = (n: number) => String(n).padStart(2, '0')

/** "08.09.2026". Date-only strings ("2025-06-27") are not shifted by the time zone. */
export function formatDate(value: string | number | Date) {
  if (typeof value === 'string') {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
    if (m) return `${m[3]}.${m[2]}.${m[1]}`
  }
  const d = new Date(value)
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`
}

/** "08.09.2026 05:00" */
export function formatDateTime(value: string | number | Date) {
  const d = new Date(value)
  return `${formatDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
