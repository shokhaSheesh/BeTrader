import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toTransaction } from '../model/types'

export const TRANSACTIONS_TABLE = 'transactions'

export const useTransactionsQuery = (params: ListParams) =>
  useTableListQuery(TRANSACTIONS_TABLE, params, toTransaction)
export const useTransactionQuery = (id: string | undefined) =>
  useTableItemQuery(TRANSACTIONS_TABLE, id, toTransaction)
