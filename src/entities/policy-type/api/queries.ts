import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toPolicyType } from '../model/types'

export const POLICY_TYPES_TABLE = 'policy_Type'

export const usePolicyTypesQuery = (params: ListParams) =>
  useTableListQuery(POLICY_TYPES_TABLE, params, toPolicyType)
export const usePolicyTypeQuery = (id: string | undefined) =>
  useTableItemQuery(POLICY_TYPES_TABLE, id, toPolicyType)
