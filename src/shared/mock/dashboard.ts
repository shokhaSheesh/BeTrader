import type { DashboardDto } from '@/entities/dashboard'
import { db } from './db'
import type { Row } from './seed'

// Stands in for the Dashboard endpoint we asked the backend for (entities/dashboard): the
// DataLens widgets, computed from the demo tables for the requested period.

const round = (n: number) => Math.round(n * 100) / 100
const day = (v: unknown) => String(v ?? '').slice(0, 10)
const first = (v: unknown) => (Array.isArray(v) ? v[0] : v)
const sum = <T>(rows: T[], value: (r: T) => number) => round(rows.reduce((s, r) => s + value(r), 0))

export function mockDashboard(params: { from?: string; to?: string }): DashboardDto {
  const t = db()
  const today = new Date().toISOString().slice(0, 10)
  const earliest = t.investors.reduce(
    (m, i) => (day(i.created_time) < m ? day(i.created_time) : m),
    today,
  )
  const from = params.from || earliest
  const to = params.to || today
  const inPeriod = (v: unknown) => day(v) >= from && day(v) <= to

  const days: string[] = []
  for (
    let d = new Date(`${from}T00:00:00Z`);
    day(d.toISOString()) <= to;
    d.setUTCDate(d.getUTCDate() + 1)
  )
    days.push(d.toISOString().slice(0, 10))
  const perDay = <T>(rows: T[], when: (r: T) => unknown, value: (r: T) => number) => {
    const map = new Map<string, number>()
    for (const r of rows) map.set(day(when(r)), (map.get(day(when(r))) ?? 0) + value(r))
    return (d: string) => round(map.get(d) ?? 0)
  }

  const investors = t.investors.filter((i) => inPeriod(i.created_time))
  const confirmed = (r: Row) => first(r.status) === 'confirmed'
  const buys = t.orders.filter(
    (o) => first(o.type) === 'buy' && confirmed(o) && inPeriod(o.created_time),
  )
  const topups = t.transactions.filter(
    (x) => first(x.operation) === 'topup' && confirmed(x) && inPeriod(x.created_time),
  )
  const dividends = t.dividend.filter((d) => inPeriod(d.created_at))

  const investorOf = new Map(t.investors.map((i) => [i.guid, i]))
  const projectOf = new Map(t.projects.map((p) => [p.guid, p]))
  const typeOf = new Map(t.project_types.map((x) => [x.guid, x]))
  const tariffOf = (projectId: unknown) => {
    const project = projectOf.get(projectId as string)
    return project
      ? ((typeOf.get(project.project_types_id as string)?.name_en as string) ?? null)
      : null
  }
  const name = (investorId: unknown) =>
    String(investorOf.get(investorId as string)?.full_name ?? '—')

  const registrations = perDay(
    investors,
    (i) => i.created_time,
    () => 1,
  )
  const invested = perDay(
    buys,
    (o) => o.created_time,
    (o) => Number(o.amount_usd),
  )
  const rates = new Map(t.currency_rates.map((r) => [day(r.date), r]))

  return {
    kpis: {
      investors: investors.length,
      deposits_uzs: sum(topups, (x) => Number(x.amount_uzs)),
      investments_usd: sum(buys, (o) => Number(o.amount_usd)),
      dividends_usd: sum(dividends, (d) => Number(d.amount_usd)),
    },
    registrations_per_day: days.map((date) => ({ date, count: registrations(date) })),
    usd_rate_per_day: days
      .filter((d) => rates.has(d))
      .map((date) => {
        const r = rates.get(date)!
        return { date, niyat: Number(r.amount_with_percent), central_bank: Number(r.amount) }
      }),
    investments_per_day: days.map((date) => ({ date, amount_usd: invested(date) })),
    by_tariff: t.project_types.map((type) => {
      const name = type.name_en as string
      const own = buys.filter((o) => tariffOf(o.projects_id) === name)
      return {
        tariff: name,
        dividends_usd: sum(
          dividends.filter((d) => tariffOf(d.projects_id) === name),
          (d) => Number(d.amount_usd),
        ),
        investors: new Set(own.map((o) => o.investors_id)).size,
        investments_usd: sum(own, (o) => Number(o.amount_usd)),
      }
    }),
    latest_investors: [...investors]
      .sort((a, b) => String(b.created_time).localeCompare(String(a.created_time)))
      .slice(0, 10)
      .map((i) => ({
        guid: i.guid,
        full_name: String(i.full_name),
        phone: (i.phone as string) ?? null,
        is_identified: !!i.is_identified,
        created_time: String(i.created_time),
      })),
    latest_investments: [...buys]
      .sort((a, b) => String(b.created_time).localeCompare(String(a.created_time)))
      .slice(0, 10)
      .map((o) => {
        const inv = investorOf.get(o.investors_id as string)
        return {
          guid: o.guid,
          full_name: name(o.investors_id),
          tariff: tariffOf(o.projects_id),
          phone: (inv?.phone as string) ?? null,
          passport: (inv?.passport as string) ?? null,
          transaction_id: (o.transaction_id as string) ?? null,
          created_time: String(o.created_time),
          rate: Number(o.currency_rate),
          amount_usd: Number(o.amount_usd),
          amount_uzs: Number(o.amount_uzs),
        }
      }),
    latest_dividends: [...dividends]
      .sort((a, b) => String(b.to_date).localeCompare(String(a.to_date)))
      .slice(0, 10)
      .map((d) => ({
        guid: d.guid,
        full_name: name(d.investors_id),
        tariff: tariffOf(d.projects_id),
        to_date: String(d.to_date),
        amount_usd: Number(d.amount_usd),
      })),
  }
}
