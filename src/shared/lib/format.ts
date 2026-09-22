const moneyFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 })

/** 1250000 → "1 250 000 UZS" */
export function formatMoney(amount: number, currency = 'UZS') {
  return `${moneyFormatter.format(amount)} ${currency}`
}

const dateTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export function formatDateTime(value: string | number | Date) {
  return dateTimeFormatter.format(new Date(value))
}
