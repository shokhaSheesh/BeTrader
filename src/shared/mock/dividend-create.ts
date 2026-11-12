import { createRow, db } from './db'

// Stands in for u-code's `betrader-gateway` function, method "create" on "dividends" (the
// project's Divident button, features/project-dividend): the total profit is shared among the
// project's active holdings in proportion to each investment, one dividend row per investor.

const round = (n: number) => Math.round(n * 100) / 100

export function mockCreateDividends(input: {
  from: string
  to: string
  projects_id: string
  profit: number
}) {
  const t = db()
  const holdings = t.project_investors.filter(
    (h) => h.projects_id === input.projects_id && h.status !== 'closed' && Number(h.investment) > 0,
  )
  const total = holdings.reduce((s, h) => s + Number(h.investment), 0)
  if (!holdings.length || total <= 0) throw new Error('The project has no active investments')

  const rate = Number(
    [...t.currency_rates].sort((a, b) => String(b.date).localeCompare(String(a.date)))[0]?.amount ??
      12_500,
  )
  const days = Math.max(1, Math.round((Date.parse(input.to) - Date.parse(input.from)) / 86_400_000))

  for (const h of holdings) {
    const investment = Number(h.investment)
    const share = round((input.profit * investment) / total)
    createRow('dividend', {
      investors_id: h.investors_id,
      projects_id: h.projects_id,
      type: ['profit'],
      from_date: input.from,
      to_date: input.to,
      period_days: days,
      days,
      percent: round((share / investment) * 100 * 1000) / 1000,
      amount_usd: share,
      amount_uzs: round(share * rate),
      order_amount: investment,
      nominal_amount_usd: input.profit,
      remaining_amount_usd: 0,
    })
    // The holding's interest income and the investor's dividend account grow by the share
    h.dividend = round(Number(h.dividend ?? 0) + share)
    h.dividend_uzs = round(Number(h.dividend_uzs ?? 0) + share * rate)
    const account = t.account.find((a) => a.investors_id === h.investors_id)
    if (account) account.dividend = round(Number(account.dividend ?? 0) + share)
  }
  return { created: holdings.length }
}
