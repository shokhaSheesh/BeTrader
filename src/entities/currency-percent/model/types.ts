/** Raw row of `currency_percent`. */
export interface CurrencyPercentDto {
  guid: string
  type: string[] | null
  percent: number | null
  created_at: string
  updated_at: string
}

export interface CurrencyPercent {
  id: string
  type: string[]
  percent: number | null
  createdAt: string
  updatedAt: string
}

export const toCurrencyPercent = (d: CurrencyPercentDto): CurrencyPercent => ({
  id: d.guid,
  type: d.type ?? [],
  percent: d.percent,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
