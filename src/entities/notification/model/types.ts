/** Raw row of the u-code `notification` table. */
export interface NotificationItemDto {
  guid: string
  /** MULTISELECT info/warning */
  type: string[] | null
  title_en: string | null
  title_ru: string | null
  title_uz: string | null
  /** MULTI_LINE */
  content_en: string | null
  content_ru: string | null
  content_uz: string | null
  link: string | null
  /** DATE_TIME */
  send_at: string | null
  /** CHECKBOX "Is Sent" */
  is_sent: boolean | null
  /** PHOTO */
  image: string | null
  created_at: string
  updated_at: string
}

export interface NotificationItem {
  id: string
  type: string[]
  titleEn: string | null
  titleRu: string | null
  titleUz: string | null
  contentEn: string | null
  contentRu: string | null
  contentUz: string | null
  link: string | null
  sendAt: string | null
  isSent: boolean | null
  image: string | null
  createdAt: string
  updatedAt: string
}

export const toNotificationItem = (d: NotificationItemDto): NotificationItem => ({
  id: d.guid,
  type: d.type ?? [],
  titleEn: d.title_en || null,
  titleRu: d.title_ru || null,
  titleUz: d.title_uz || null,
  contentEn: d.content_en || null,
  contentRu: d.content_ru || null,
  contentUz: d.content_uz || null,
  link: d.link || null,
  sendAt: d.send_at || null,
  isSent: d.is_sent,
  image: d.image || null,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
