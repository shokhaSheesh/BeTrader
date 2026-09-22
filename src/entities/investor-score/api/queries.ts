import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toInvestorScore } from '../model/types'

export const INVESTOR_SCORE_TABLE = 'investor_score'

export const useInvestorScoresQuery = (params: ListParams) =>
  useTableListQuery(INVESTOR_SCORE_TABLE, params, toInvestorScore)
export const useInvestorScoreQuery = (id: string | undefined) =>
  useTableItemQuery(INVESTOR_SCORE_TABLE, id, toInvestorScore)
