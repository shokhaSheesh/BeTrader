import type { DividendAnalyticsRow } from '@/entities/dividend-analytics'
import { db } from './db'

// Stands in for the endpoint behind "Dividends per investor" (entities/dividend-analytics):
// the Metabase report's columns, one row per investor with dividends in the period.

/** Withholding tax on individuals' dividends in Uzbekistan, applied to the whole amount */
const TAX_RATE = 0.05
const round = (n: number) => Math.round(n * 100) / 100

export function mockDividendAnalytics(params: {
  from?: string
  to?: string
  offset?: number | string
  limit?: number | string
}) {
  const t = db()
  const from = params.from || '0000-01-01'
  const to = params.to || '9999-12-31'
  const totals = new Map<string, number>()
  for (const d of t.dividend) {
    const day = String(d.created_at).slice(0, 10)
    if (day < from || day > to) continue
    const id = d.investors_id as string
    totals.set(id, (totals.get(id) ?? 0) + Number(d.amount_usd ?? 0))
  }
  const investorOf = new Map(t.investors.map((i) => [i.guid, i]))
  const rows: DividendAnalyticsRow[] = [...totals]
    .map(([id, amount]) => {
      const inv = investorOf.get(id)
      const taxable = round(amount)
      return {
        investors_id: id,
        full_name: String(inv?.full_name ?? '—'),
        pinfl: (inv?.pinfl as string) ?? null,
        dividend_amount: round(amount),
        taxable_base: taxable,
        tax_withheld: round(taxable * TAX_RATE),
      }
    })
    .sort((a, b) => a.full_name.localeCompare(b.full_name))
  const offset = Number(params.offset ?? 0)
  const limit = Number(params.limit ?? 20)
  return { count: rows.length, response: rows.slice(offset, offset + limit) }
}
