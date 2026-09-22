import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toEmployee } from '../model/types'

export const EMPLOYEES_TABLE = 'employee'

export const useEmployeesQuery = (params: ListParams) =>
  useTableListQuery(EMPLOYEES_TABLE, params, toEmployee)
export const useEmployeeQuery = (id: string | undefined) =>
  useTableItemQuery(EMPLOYEES_TABLE, id, toEmployee)
