import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toRbaRule } from '../model/types'

export const RBA_MATRIX_TABLE = 'rba_matrix'

export const useRbaRulesQuery = (params: ListParams) =>
  useTableListQuery(RBA_MATRIX_TABLE, params, toRbaRule)
export const useRbaRuleQuery = (id: string | undefined) =>
  useTableItemQuery(RBA_MATRIX_TABLE, id, toRbaRule)
