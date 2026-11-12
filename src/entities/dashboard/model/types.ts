/**
 * The Dashboard's numbers, as one backend response (docs/DASHBOARDS.md → `/dashboard`).
 * Every total, count and per-day series is computed by the backend for the requested period;
 * the page only lays it out (DESIGN.md §0).
 */
export interface DashboardDto {
  kpis: {
    investors: number
    deposits_uzs: number
    investments_usd: number
    dividends_usd: number
  }
  /** One entry per day of the period, zero-filled */
  registrations_per_day: { date: string; count: number }[]
  /** UZS per USD: Niyat's rate and the Central Bank's */
  usd_rate_per_day: { date: string; niyat: number; central_bank: number }[]
  investments_per_day: { date: string; amount_usd: number }[]
  by_tariff: {
    tariff: string
    dividends_usd: number
    /** Investors with an investment in this tariff */
    investors: number
    investments_usd: number
  }[]
  latest_investors: {
    guid: string
    full_name: string
    phone: string | null
    is_identified: boolean
    created_time: string
  }[]
  latest_investments: {
    guid: string
    full_name: string
    tariff: string | null
    phone: string | null
    passport: string | null
    transaction_id: string | null
    created_time: string
    rate: number
    amount_usd: number
    amount_uzs: number
  }[]
  latest_dividends: {
    guid: string
    full_name: string
    tariff: string | null
    to_date: string
    amount_usd: number
  }[]
}

export interface DashboardPeriod {
  /** inclusive, YYYY-MM-DD; null = from the start */
  from: string | null
  /** inclusive, YYYY-MM-DD; null = up to today */
  to: string | null
}
