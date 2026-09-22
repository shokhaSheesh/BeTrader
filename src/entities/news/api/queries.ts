import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toNewsItem } from '../model/types'

export const NEWS_TABLE = 'news'

export const useNewsQuery = (params: ListParams) =>
  useTableListQuery(NEWS_TABLE, params, toNewsItem)
export const useNewsItemQuery = (id: string | undefined) =>
  useTableItemQuery(NEWS_TABLE, id, toNewsItem)
