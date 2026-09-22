import type { InvestorJoin } from '@/shared/api/joins'

/** Raw row of the u-code `documents` table. */
export interface DocumentItemDto {
  guid: string
  title_en: string | null
  title_ru: string | null
  title_uz: string | null
  /** FILE (URL) */
  file: string | null
  /** FILE (URL) */
  file_en: string | null
  /** FILE (URL) */
  file_uz: string | null
  investors_id: string | null
  investors_id_data: InvestorJoin
  created_at: string
  updated_at: string
}

export interface DocumentItem {
  id: string
  titleEn: string | null
  titleRu: string | null
  titleUz: string | null
  file: string | null
  fileEn: string | null
  fileUz: string | null
  investorId: string | null
  investorName: string | null
  investorPhone: string | null
  createdAt: string
  updatedAt: string
}

export const toDocumentItem = (d: DocumentItemDto): DocumentItem => ({
  id: d.guid,
  titleEn: d.title_en || null,
  titleRu: d.title_ru || null,
  titleUz: d.title_uz || null,
  file: d.file || null,
  fileEn: d.file_en || null,
  fileUz: d.file_uz || null,
  investorId: d.investors_id || null,
  investorName: d.investors_id_data?.full_name || null,
  investorPhone: d.investors_id_data?.phone || null,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
