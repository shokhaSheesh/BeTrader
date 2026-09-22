import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toFaqItem } from '../model/types'

export const FAQ_TABLE = 'faq'

export const useFaqItemsQuery = (params: ListParams) =>
  useTableListQuery(FAQ_TABLE, params, toFaqItem)
export const useFaqItemQuery = (id: string | undefined) =>
  useTableItemQuery(FAQ_TABLE, id, toFaqItem)
