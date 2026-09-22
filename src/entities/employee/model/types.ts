import type { NameJoin } from '@/shared/api/joins'

/**
 * Raw row of the u-code `employee` table.
 * `password` and `user_id_auth` are deliberately NOT mapped: never shown (docs/API.md).
 */
export interface EmployeeDto {
  guid: string
  login: string | null
  /** PHOTO */
  photo: string | null
  role_id: string | null
  role_id_data: NameJoin
  client_type_id: string | null
  client_type_id_data: NameJoin
  created_at: string
  updated_at: string
}

export interface Employee {
  id: string
  login: string | null
  photo: string | null
  roleId: string | null
  clientTypeId: string | null
  role: string | null
  clientType: string | null
  createdAt: string
  updatedAt: string
}

export const toEmployee = (d: EmployeeDto): Employee => ({
  id: d.guid,
  login: d.login || null,
  photo: d.photo || null,
  roleId: d.role_id || null,
  clientTypeId: d.client_type_id || null,
  role: d.role_id_data?.name || null,
  clientType: d.client_type_id_data?.name || null,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
