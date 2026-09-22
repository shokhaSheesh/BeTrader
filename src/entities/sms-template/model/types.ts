/** Raw row of the u-code `sms_template` table. */
export interface SmsTemplateDto {
  guid: string
  en: string | null
  ru: string | null
  uz: string | null
  /** "Text": filled on 1 of 7 rows */
  text: string | null
  created_at: string
  updated_at: string
}

export interface SmsTemplate {
  id: string
  en: string | null
  ru: string | null
  uz: string | null
  text: string | null
  createdAt: string
  updatedAt: string
}

export const toSmsTemplate = (d: SmsTemplateDto): SmsTemplate => ({
  id: d.guid,
  en: d.en || null,
  ru: d.ru || null,
  uz: d.uz || null,
  text: d.text || null,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
