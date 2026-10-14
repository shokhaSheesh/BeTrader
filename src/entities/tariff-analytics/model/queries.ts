import type { AggregationRequest } from '@/shared/api/ucode'

/**
 * The SQL behind "Analytics by tariff", taken from u-code's own microfrontend for this report
 * (docs/API.md → Aggregation). Deposits are every `buy` order, numbered per investor and project;
 * dividends are summed per investor and project over the chosen period and shown on the first deposit only.
 */
const DEPOSITS = `(
  SELECT
    o.investors_id AS investors_id,
    o.projects_id AS projects_id,
    o.created_time AS created_time,
    o.amount_usd AS amount_usd,
    o.amount_uzs AS amount_uzs,
    o.currency_rate AS currency_rate,
    ROW_NUMBER() OVER (
      PARTITION BY o.investors_id, o.projects_id
      ORDER BY o.created_time
    ) AS deposit_index
  FROM
    orders o
  WHERE 'buy' = ANY(o.type)
) dep`

const DIVIDENDS_ON_FIRST_DEPOSIT = `CASE WHEN dep.deposit_index = 1 THEN COALESCE(dv.dividend_usd, 0) ELSE 0 END`

/** SQL string literal: single quotes doubled, so a search term can't break the query. */
const quote = (value: string) => `'${value.replace(/'/g, "''")}'`

function joins({ from, to }: Period) {
  return [
    {
      type: 'LEFT' as const,
      table: `(
  SELECT
    d.investors_id AS investors_id,
    d.projects_id AS projects_id,
    SUM(d.amount_usd) AS dividend_usd
  FROM
    dividend d
  WHERE created_at >= ${quote(from)} AND created_at < ${quote(to)}
  GROUP BY
    d.investors_id,
    d.projects_id
) dv`,
      condition: 'dv.investors_id = dep.investors_id AND dv.projects_id = dep.projects_id',
    },
    { type: 'LEFT' as const, table: 'projects AS p', condition: 'p.guid = dep.projects_id' },
    {
      type: 'LEFT' as const,
      table: 'project_types AS pt',
      condition: 'pt.guid = p.project_types_id',
    },
    { type: 'LEFT' as const, table: 'investors AS i', condition: 'i.guid = dep.investors_id' },
  ]
}

export interface Period {
  /** inclusive, YYYY-MM-DD */
  from: string
  /** exclusive, YYYY-MM-DD */
  to: string
}

const searchWhere = (search: string) =>
  search.trim()
    ? `(i.name ILIKE ${quote(`%${search.trim()}%`)} OR i.surname ILIKE ${quote(`%${search.trim()}%`)})`
    : undefined

/** One line per deposit: investor × tariff, ordered as the report shows them. */
export const depositsQuery = (period: Period, search: string): AggregationRequest => ({
  table: DEPOSITS,
  joins: joins(period),
  where: searchWhere(search),
  columns: [
    'p.name_en AS project_name',
    'p.name_ru AS project_name_ru',
    "CONCAT(i.name, ' ', i.surname) AS full_name",
    "CONCAT(pt.from_percent, '% - ', pt.to_percent, '%') AS percent",
    "TO_CHAR(dep.created_time, 'YYYY-MM-DD HH24:MI') AS deposit_at",
    'dep.deposit_index AS deposit_index',
    'CAST(dep.amount_usd AS numeric(15,2)) AS investment_usd',
    'CAST(dep.amount_uzs AS numeric(18,2)) AS investment_uzs',
    'CAST(dep.currency_rate AS numeric(15,2)) AS rate',
    `CAST(${DIVIDENDS_ON_FIRST_DEPOSIT} AS numeric(15,2)) AS dividend_usd`,
  ],
  // The accepted report orders tariffs by their Russian name: keep that order here too.
  order_by: ['full_name ASC', 'project_name_ru ASC', 'deposit_index ASC'],
})

const TOTAL_COLUMNS = [
  'COUNT(DISTINCT dep.investors_id) AS investors',
  'CAST(SUM(dep.amount_usd) AS numeric(15,2)) AS investment_usd',
  'CAST(SUM(dep.amount_uzs) AS numeric(18,2)) AS investment_uzs',
  // The report's rate total is weighted (total UZS ÷ total USD), not a plain average.
  'CAST(SUM(dep.amount_uzs) / NULLIF(SUM(dep.amount_usd), 0) AS numeric(15,2)) AS rate',
  `CAST(SUM(${DIVIDENDS_ON_FIRST_DEPOSIT}) AS numeric(15,2)) AS dividend_usd`,
]

/** Totals per tariff, summed by the backend (DESIGN.md §0: no front-end calculations). */
export const totalsQuery = (period: Period, search: string): AggregationRequest => ({
  table: DEPOSITS,
  joins: joins(period),
  where: searchWhere(search),
  columns: ['p.name_en AS project_name', 'p.name_ru AS project_name_ru', ...TOTAL_COLUMNS],
  group_by: ['p.name_en', 'p.name_ru'],
  order_by: ['project_name_ru ASC'],
})

/** One grand total across all tariffs (investors counted once). */
export const grandTotalQuery = (period: Period, search: string): AggregationRequest => ({
  table: DEPOSITS,
  joins: joins(period),
  where: searchWhere(search),
  columns: TOTAL_COLUMNS,
})
