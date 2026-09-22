/** Raw row of the u-code `news` table. */
export interface NewsItemDto {
  guid: string
  title_en: string | null
  title_ru: string | null
  title_uz: string | null
  /** MULTI_LINE; labelled "Descibtion" (sic) */
  description_en: string | null
  description_ru: string | null
  description_uz: string | null
  /** PHOTO */
  photo: string | null
  /** "Create time" */
  created_time: string | null
  created_at: string
  updated_at: string
}

export interface NewsItem {
  id: string
  titleEn: string | null
  titleRu: string | null
  titleUz: string | null
  descriptionEn: string | null
  descriptionRu: string | null
  descriptionUz: string | null
  photo: string | null
  createdTime: string | null
  createdAt: string
  updatedAt: string
}

export const toNewsItem = (d: NewsItemDto): NewsItem => ({
  id: d.guid,
  titleEn: d.title_en || null,
  titleRu: d.title_ru || null,
  titleUz: d.title_uz || null,
  descriptionEn: d.description_en || null,
  descriptionRu: d.description_ru || null,
  descriptionUz: d.description_uz || null,
  photo: d.photo || null,
  createdTime: d.created_time || null,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
