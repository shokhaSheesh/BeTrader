/** One deposit (a `buy` order) of an investor into one tariff. */
export interface TariffDeposit {
  projectName: string | null
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
  investors: number | null
  investmentUsd: number | null
  investmentUzs: number | null
  rate: number | null
  dividendUsd: number | null
}

interface DepositRow {
  project_name: string | null
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
  investors: number | null
  investment_usd: number | null
  investment_uzs: number | null
  rate: number | null
  dividend_usd: number | null
}

export const toDeposit = (r: DepositRow): TariffDeposit => ({
  projectName: r.project_name,
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
  investors: r.investors,
  investmentUsd: r.investment_usd,
  investmentUzs: r.investment_uzs,
  rate: r.rate,
  dividendUsd: r.dividend_usd,
})

/** Investors as rows, each with their deposits per tariff (the report's layout). */
export interface InvestorRow {
  fullName: string | null
  percent: string | null
  /** tariff name → that investor's deposits, in order */
  byTariff: Map<string, TariffDeposit[]>
  /** how many lines this investor needs */
  lines: number
}

export function groupByInvestor(deposits: TariffDeposit[]): InvestorRow[] {
  const rows = new Map<string, InvestorRow>()
  for (const d of deposits) {
    const key = d.fullName ?? '—'
    const row = rows.get(key) ?? {
      fullName: d.fullName,
      percent: d.percent,
      byTariff: new Map(),
      lines: 0,
    }
    const tariff = d.projectName ?? '—'
    const list = row.byTariff.get(tariff) ?? []
    list.push(d)
    row.byTariff.set(tariff, list)
    row.lines = Math.max(row.lines, list.length)
    rows.set(key, row)
  }
  return [...rows.values()]
}
