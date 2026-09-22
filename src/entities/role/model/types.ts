/** A role from u-code's auth API (`GET /v2/role`). */
export interface RoleDto {
  guid: string
  name: string
  client_type_id: string | null
  is_system: boolean
  status: boolean
}

export interface Role {
  id: string
  name: string
  clientTypeId: string | null
  isSystem: boolean
  isActive: boolean
}

export const toRole = (d: RoleDto): Role => ({
  id: d.guid,
  name: d.name,
  clientTypeId: d.client_type_id,
  isSystem: d.is_system,
  isActive: d.status,
})
