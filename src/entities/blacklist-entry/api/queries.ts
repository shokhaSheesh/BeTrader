import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toBlacklistEntry } from '../model/types'

export const BLACKLIST_TABLE = 'black_list'

export const useBlacklistEntriesQuery = (params: ListParams) =>
  useTableListQuery(BLACKLIST_TABLE, params, toBlacklistEntry)
export const useBlacklistEntryQuery = (id: string | undefined) =>
  useTableItemQuery(BLACKLIST_TABLE, id, toBlacklistEntry)
