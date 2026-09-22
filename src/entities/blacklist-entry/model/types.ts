/** Raw row of the u-code `black_list` table. */
export interface BlacklistEntryDto {
  guid: string
  /** backend label is literally "nadejda" (see docs/API.md) */
  name: string | null
  surname: string | null
  passport: string | null
  /** " Pin" (PINFL) */
  pin: string | null
  created_at: string
  updated_at: string
}

export interface BlacklistEntry {
  id: string
  name: string | null
  surname: string | null
  passport: string | null
  pin: string | null
  createdAt: string
  updatedAt: string
}

export const toBlacklistEntry = (d: BlacklistEntryDto): BlacklistEntry => ({
  id: d.guid,
  name: d.name || null,
  surname: d.surname || null,
  passport: d.passport || null,
  pin: d.pin || null,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
