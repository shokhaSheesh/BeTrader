import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toDividend } from '../model/types'

export const DIVIDENDS_TABLE = 'dividend'

export const useDividendsQuery = (params: ListParams) =>
  useTableListQuery(DIVIDENDS_TABLE, params, toDividend)
export const useDividendQuery = (id: string | undefined) =>
  useTableItemQuery(DIVIDENDS_TABLE, id, toDividend)
