/** One deposit (a `buy` order) of an investor into one tariff. */
export interface TariffDeposit {
  projectName: string | null
  /** The Russian name the Excel export uses for its column groups */
  projectNameRu: string | null
  fullName: string | null
  percent: string | null
  depositAt: string | null
  depositIndex: number
  investmentUsd: number | null
  investmentUzs: number | null
  rate: number | null
  dividendUsd: number | null
}

export interface TariffTotals {
  projectName?: string | null
  projectNameRu?: string | null
  investors: number | null
  investmentUsd: number | null
  investmentUzs: number | null
  rate: number | null
  dividendUsd: number | null
}

interface DepositRow {
  project_name: string | null
  project_name_ru: string | null
  full_name: string | null
  percent: string | null
  deposit_at: string | null
  deposit_index: number
  investment_usd: number | null
  investment_uzs: number | null
  rate: number | null
  dividend_usd: number | null
}

interface TotalsRow {
  project_name?: string | null
  project_name_ru?: string | null
  investors: number | null
  investment_usd: number | null
  investment_uzs: number | null
  rate: number | null
  dividend_usd: number | null
}

export const toDeposit = (r: DepositRow): TariffDeposit => ({
  projectName: r.project_name,
  projectNameRu: r.project_name_ru,
  fullName: r.full_name,
  percent: r.percent,
  depositAt: r.deposit_at,
  depositIndex: r.deposit_index,
  investmentUsd: r.investment_usd,
  investmentUzs: r.investment_uzs,
  rate: r.rate,
  dividendUsd: r.dividend_usd,
})

export const toTotals = (r: TotalsRow): TariffTotals => ({
  projectName: r.project_name,
  projectNameRu: r.project_name_ru,
  investors: r.investors,
  investmentUsd: r.investment_usd,
  investmentUzs: r.investment_uzs,
  rate: r.rate,
  dividendUsd: r.dividend_usd,
})

/**
 * Row order of the report: investor name, then tariff, then the deposit's own order.
 * Sorted here, not in SQL: the report collates names with ICU rules (`O‘TKIRJON` before
 * `OKSANA`), which the database's own collation does not.
 */
const collator = new Intl.Collator('en', { numeric: true })

export const sortDeposits = (deposits: TariffDeposit[]): TariffDeposit[] =>
  [...deposits].sort(
    (a, b) =>
      collator.compare(a.fullName ?? '', b.fullName ?? '') ||
      collator.compare(a.projectNameRu ?? '', b.projectNameRu ?? '') ||
      a.depositIndex - b.depositIndex,
  )

/** One tariff's deposits for an investor: the percent belongs to the tariff, not the investor. */
export interface TariffBlock {
  tariff: string
  percent: string | null
  deposits: TariffDeposit[]
}

/** An investor as the report lays them out: their name spans one line per deposit. */
export interface InvestorRow {
  fullName: string | null
  blocks: TariffBlock[]
  /** total lines, i.e. how far the name cell spans */
  lines: number
}

/** Groups sorted deposits into the report's rows: investor → tariff block → one line each. */
export function groupByInvestor(deposits: TariffDeposit[]): InvestorRow[] {
  const rows: InvestorRow[] = []
  for (const deposit of deposits) {
    let row = rows.at(-1)
    if (!row || row.fullName !== deposit.fullName) {
      row = { fullName: deposit.fullName, blocks: [], lines: 0 }
      rows.push(row)
    }
    const tariff = deposit.projectName ?? '—'
    let block = row.blocks.at(-1)
    if (!block || block.tariff !== tariff) {
      block = { tariff, percent: deposit.percent, deposits: [] }
      row.blocks.push(block)
    }
    block.deposits.push(deposit)
    row.lines++
  }
  return rows
}
