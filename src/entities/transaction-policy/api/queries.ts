import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toTransactionPolicy } from '../model/types'

export const TRANSACTION_POLICY_TABLE = 'transaction_policy'

export const useTransactionPoliciesQuery = (params: ListParams) =>
  useTableListQuery(TRANSACTION_POLICY_TABLE, params, toTransactionPolicy)
export const useTransactionPolicyQuery = (id: string | undefined) =>
  useTableItemQuery(TRANSACTION_POLICY_TABLE, id, toTransactionPolicy)
