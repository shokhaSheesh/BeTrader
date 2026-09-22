/**
 * Where color goes in data. One place, so the whole app stays consistent (DESIGN.md §5 "Color in data").
 *
 * Only values someone should *notice* get a color: statuses, money operations and a few key types.
 * Everything else (currency, account, payment type…) stays neutral. Colors carry meaning:
 *   success = done / money in · danger = money out (sell, outgoing) or failed · warning = needs attention
 *   info = purchase · accent (lime) = Niyat income (dividends, totals) · neutral = everything else
 *
 * Presentation only: the values and their labels still come from the backend (DESIGN.md §0).
 */
export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent'

const OPTION_TONES: Record<string, Record<string, Tone>> = {
  // orders, transactions
  status: {
    pending: 'warning',
    confirmed: 'success',
    canceled: 'danger',
    invest: 'success',
    test: 'warning',
    // bitrix_leads (integration log)
    error: 'danger',
    created: 'success',
    deposit_updated: 'info',
  },
  // transactions
  operation: {
    topup: 'success',
    withdraw: 'warning',
    buy: 'info',
    dividend: 'accent',
    transfer: 'neutral',
  },
  // orders (buy/sell), dividends (profit/debit), notifications (info/warning)
  type: {
    buy: 'info',
    sell: 'danger',
    profit: 'success',
    debit: 'danger',
    info: 'info',
    warning: 'warning',
  },
}

/** Tone for a backend option value; unknown values are neutral. */
export const toneFor = (field: string, value: string): Tone =>
  OPTION_TONES[field]?.[value] ?? 'neutral'

/** Background + text classes for each tone (badges and icon circles). */
export const TONE_CLASSES: Record<Tone, { tint: string; text: string }> = {
  neutral: { tint: 'bg-surface-muted', text: 'text-fg-muted' },
  success: { tint: 'bg-success-tint', text: 'text-success-text' },
  warning: { tint: 'bg-warning-tint', text: 'text-warning-text' },
  danger: { tint: 'bg-danger-tint', text: 'text-danger-text' },
  info: { tint: 'bg-info-tint', text: 'text-info-text' },
  accent: { tint: 'bg-accent-tint', text: 'text-on-accent-tint' },
}
