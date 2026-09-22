import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toNotificationItem } from '../model/types'

export const NOTIFICATIONS_TABLE = 'notification'

export const useNotificationsQuery = (params: ListParams) =>
  useTableListQuery(NOTIFICATIONS_TABLE, params, toNotificationItem)
export const useNotificationItemQuery = (id: string | undefined) =>
  useTableItemQuery(NOTIFICATIONS_TABLE, id, toNotificationItem)
