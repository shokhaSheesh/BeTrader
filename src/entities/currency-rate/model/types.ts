/** Raw row of `currency_rates`: one rate per day. */
export interface CurrencyRateDto {
  guid: string
  /** DATE */
  date: string | null
  amount: number | null
  percent: number | null
  amount_with_percent: number | null
  created_at: string
  updated_at: string
}

export interface CurrencyRate {
  id: string
  date: string | null
  amount: number | null
  percent: number | null
  amountWithPercent: number | null
  createdAt: string
  updatedAt: string
}

export const toCurrencyRate = (d: CurrencyRateDto): CurrencyRate => ({
  id: d.guid,
  date: d.date,
  amount: d.amount,
  percent: d.percent,
  amountWithPercent: d.amount_with_percent,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
