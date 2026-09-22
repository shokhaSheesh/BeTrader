/** Raw row of the u-code `about_us` table. */
export interface AboutUsDto {
  guid: string
  /** MULTI_LINE */
  text_en: string | null
  text_ru: string | null
  text_uz: string | null
  /** MULTI_FILE: URLs */
  files: string[] | null
  created_at: string
  updated_at: string
}

export interface AboutUs {
  id: string
  textEn: string | null
  textRu: string | null
  textUz: string | null
  files: string[]
  createdAt: string
  updatedAt: string
}

export const toAboutUs = (d: AboutUsDto): AboutUs => ({
  id: d.guid,
  textEn: d.text_en || null,
  textRu: d.text_ru || null,
  textUz: d.text_uz || null,
  files: d.files ?? [],
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
