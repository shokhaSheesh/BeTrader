import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toCurrencyPercent } from '../model/types'

export const CURRENCY_PERCENT_TABLE = 'currency_percent'

export const useCurrencyPercentsQuery = (params: ListParams) =>
  useTableListQuery(CURRENCY_PERCENT_TABLE, params, toCurrencyPercent)
export const useCurrencyPercentQuery = (id: string | undefined) =>
  useTableItemQuery(CURRENCY_PERCENT_TABLE, id, toCurrencyPercent)
