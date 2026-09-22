import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toAboutUs } from '../model/types'

export const ABOUT_US_TABLE = 'about_us'

export const useAboutUsItemsQuery = (params: ListParams) =>
  useTableListQuery(ABOUT_US_TABLE, params, toAboutUs)
export const useAboutUsQuery = (id: string | undefined) =>
  useTableItemQuery(ABOUT_US_TABLE, id, toAboutUs)
