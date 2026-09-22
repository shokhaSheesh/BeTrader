import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toOrder } from '../model/types'

export const ORDERS_TABLE = 'orders'

export const useOrdersQuery = (params: ListParams) =>
  useTableListQuery(ORDERS_TABLE, params, toOrder)
export const useOrderQuery = (id: string | undefined) =>
  useTableItemQuery(ORDERS_TABLE, id, toOrder)
