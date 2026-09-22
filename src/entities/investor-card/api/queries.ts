import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toInvestorCard } from '../model/types'

export const CARDS_TABLE = 'investor_cards'

export const useInvestorCardsQuery = (params: ListParams) =>
  useTableListQuery(CARDS_TABLE, params, toInvestorCard)
export const useInvestorCardQuery = (id: string | undefined) =>
  useTableItemQuery(CARDS_TABLE, id, toInvestorCard)
