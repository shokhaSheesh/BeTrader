import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toMaintenance } from '../model/types'

export const MAINTENANCE_TABLE = 'maintenance_works'

export const useMaintenanceItemsQuery = (params: ListParams) =>
  useTableListQuery(MAINTENANCE_TABLE, params, toMaintenance)
export const useMaintenanceQuery = (id: string | undefined) =>
  useTableItemQuery(MAINTENANCE_TABLE, id, toMaintenance)
