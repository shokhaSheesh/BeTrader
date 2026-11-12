import type { AggregationRequest } from '@/shared/api/ucode'
import { db } from './db'
import type { Row } from './seed'

// Stands in for u-code's SQL endpoint for the one report that uses it ("Analytics by tariff",
// entities/tariff-analytics/model/queries.ts): the same three result sets, computed from the
// demo orders and dividends instead of SQL.

const round = (n: number) => Math.round(n * 100) / 100
const unquote = (s: string) => s.replace(/''/g, "'")

export function runMockAggregation(request: AggregationRequest) {
  const sql = request.joins?.map((j) => j.table).join('\n') ?? ''
  const period = /created_at >= '([^']*)' AND created_at < '([^']*)'/.exec(sql)
  const [from, to] = period ? [period[1], period[2]] : ['0000-01-01', '9999-12-31']
  const term = request.where ? /ILIKE '%((?:[^']|'')*)%'/.exec(request.where)?.[1] : undefined
  const search = term ? unquote(term).toLowerCase() : ''

  const { orders, dividend, projects, project_types, investors } = db()
  const byId = <T extends Row>(rows: T[]) => new Map(rows.map((x) => [x.guid, x]))
  const [projectOf, typeOf, investorOf] = [byId(projects), byId(project_types), byId(investors)]

  // Every `buy` order, numbered per investor and project by time
  const counter = new Map<string, number>()
  const deposits = orders
    .filter((o) => (o.type as string[] | null)?.includes('buy'))
    .sort((a, b) => String(a.created_time).localeCompare(String(b.created_time)))
    .map((o) => {
      const key = `${o.investors_id}|${o.projects_id}`
      counter.set(key, (counter.get(key) ?? 0) + 1)
      return { o, key, index: counter.get(key)! }
    })
    .filter(({ o }) => {
      if (!search) return true
      const inv = investorOf.get(o.investors_id as string)
      return [inv?.name, inv?.surname].some((v) =>
        String(v ?? '')
          .toLowerCase()
          .includes(search),
      )
    })

  // Dividends of the period, per investor and project, shown on the first deposit only
  const dividends = new Map<string, number>()
  for (const d of dividend) {
    const day = String(d.created_at).slice(0, 10)
    if (day < from || day >= to) continue
    const key = `${d.investors_id}|${d.projects_id}`
    dividends.set(key, (dividends.get(key) ?? 0) + Number(d.amount_usd ?? 0))
  }

  const lines = deposits.map(({ o, key, index }) => {
    const project = projectOf.get(o.projects_id as string)
    const type = project ? typeOf.get(project.project_types_id as string) : undefined
    const inv = investorOf.get(o.investors_id as string)
    return {
      investor: o.investors_id as string,
      project_name: (project?.name_en as string) ?? null,
      project_name_ru: (project?.name_ru as string) ?? null,
      full_name: inv ? `${inv.name} ${inv.surname}` : null,
      percent: type ? `${type.from_percent}% - ${type.to_percent}%` : null,
      deposit_at: String(o.created_time).slice(0, 16).replace('T', ' '),
      deposit_index: index,
      investment_usd: round(Number(o.amount_usd)),
      investment_uzs: round(Number(o.amount_uzs)),
      rate: round(Number(o.currency_rate)),
      dividend_usd: round(index === 1 ? (dividends.get(key) ?? 0) : 0),
    }
  })

  const totals = (group: typeof lines) => {
    const usd = group.reduce((s, l) => s + l.investment_usd, 0)
    const uzs = group.reduce((s, l) => s + l.investment_uzs, 0)
    return {
      investors: new Set(group.map((l) => l.investor)).size,
      investment_usd: round(usd),
      investment_uzs: round(uzs),
      rate: usd ? round(uzs / usd) : null,
      dividend_usd: round(group.reduce((s, l) => s + l.dividend_usd, 0)),
    }
  }

  if (request.group_by?.length) {
    const groups = new Map<string, typeof lines>()
    for (const l of lines)
      groups.set(l.project_name ?? '—', [...(groups.get(l.project_name ?? '—') ?? []), l])
    return [...groups.values()]
      .map((g) => ({
        project_name: g[0].project_name,
        project_name_ru: g[0].project_name_ru,
        ...totals(g),
      }))
      .sort((a, b) => String(a.project_name_ru).localeCompare(String(b.project_name_ru)))
  }
  if (request.columns.some((c) => c.includes('deposit_index'))) {
    return lines.map((l) => {
      const row: Partial<typeof l> = { ...l }
      delete row.investor
      return row
    })
  }
  return lines.length ? [totals(lines)] : []
}
