import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toFinancialModel } from '../model/types'

export const FINANCIAL_MODELING_TABLE = 'financial_modeling'

export const useFinancialModelsQuery = (params: ListParams) =>
  useTableListQuery(FINANCIAL_MODELING_TABLE, params, toFinancialModel)
export const useFinancialModelQuery = (id: string | undefined) =>
  useTableItemQuery(FINANCIAL_MODELING_TABLE, id, toFinancialModel)
