/** Raw row of the u-code `contact_info` table. */
export interface ContactInfoDto {
  guid: string
  phone: string | null
  telegram: string | null
  created_at: string
  updated_at: string
}

export interface ContactInfo {
  id: string
  phone: string | null
  telegram: string | null
  createdAt: string
  updatedAt: string
}

export const toContactInfo = (d: ContactInfoDto): ContactInfo => ({
  id: d.guid,
  phone: d.phone || null,
  telegram: d.telegram || null,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
