import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toAccount } from '../model/types'

export const ACCOUNTS_TABLE = 'account'

export const useAccountsQuery = (params: ListParams) =>
  useTableListQuery(ACCOUNTS_TABLE, params, toAccount)
export const useAccountQuery = (id: string | undefined) =>
  useTableItemQuery(ACCOUNTS_TABLE, id, toAccount)
