import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toCurrencyRate } from '../model/types'

export const CURRENCY_RATES_TABLE = 'currency_rates'

export const useCurrencyRatesQuery = (params: ListParams) =>
  useTableListQuery(CURRENCY_RATES_TABLE, params, toCurrencyRate)
export const useCurrencyRateQuery = (id: string | undefined) =>
  useTableItemQuery(CURRENCY_RATES_TABLE, id, toCurrencyRate)
