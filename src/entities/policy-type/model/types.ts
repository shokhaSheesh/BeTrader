/** Raw row of the u-code `policy_Type` table. */
export interface PolicyTypeDto {
  guid: string
  /** "Label" */
  label_en: string | null
  /** backend label "Laber" (sic) */
  label_ru: string | null
  /** "Yorliq" */
  label_uz: string | null
  created_at: string
  updated_at: string
}

export interface PolicyType {
  id: string
  labelEn: string | null
  labelRu: string | null
  labelUz: string | null
  createdAt: string
  updatedAt: string
}

export const toPolicyType = (d: PolicyTypeDto): PolicyType => ({
  id: d.guid,
  labelEn: d.label_en || null,
  labelRu: d.label_ru || null,
  labelUz: d.label_uz || null,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
