/**
 * Raw row of the u-code `link_settings` table.
 */
export interface LinkSettingDto {
  guid: string
  /** "Sender Percent" */
  sender_percentage: number | null
  /** "Base URL" */
  base_url: string | null
  created_at: string
  updated_at: string
}

export interface LinkSetting {
  id: string
  senderPercentage: number | null
  baseUrl: string | null
  createdAt: string
  updatedAt: string
}

export const toLinkSetting = (d: LinkSettingDto): LinkSetting => ({
  id: d.guid,
  senderPercentage: d.sender_percentage,
  baseUrl: d.base_url || null,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
