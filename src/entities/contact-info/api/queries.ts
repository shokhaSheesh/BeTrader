import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toContactInfo } from '../model/types'

export const CONTACT_INFO_TABLE = 'contact_info'

export const useContactInfoItemsQuery = (params: ListParams) =>
  useTableListQuery(CONTACT_INFO_TABLE, params, toContactInfo)
export const useContactInfoQuery = (id: string | undefined) =>
  useTableItemQuery(CONTACT_INFO_TABLE, id, toContactInfo)
