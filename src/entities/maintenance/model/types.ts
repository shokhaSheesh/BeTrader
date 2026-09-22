/** Raw row of the u-code `maintenance_works` table. */
export interface MaintenanceDto {
  guid: string
  /** SWITCH "Maintenance works" */
  maintenance_works: boolean | null
  created_at: string
  updated_at: string
}

export interface Maintenance {
  id: string
  maintenanceWorks: boolean | null
  createdAt: string
  updatedAt: string
}

export const toMaintenance = (d: MaintenanceDto): Maintenance => ({
  id: d.guid,
  maintenanceWorks: d.maintenance_works,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
