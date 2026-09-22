/** Raw row of the u-code `project_types` table. */
export interface ProjectTypeDto {
  guid: string
  name_en: string
  name_ru: string
  name_uz: string
  /** "From %" */
  from_percent: number | null
  /** "To %" */
  to_percent: number | null
  /** MULTISELECT "Calculate dividend": labels come from GET /v2/fields/project_types */
  calculate_dividend: string[] | null
  created_at: string
  updated_at: string
}

export interface ProjectType {
  id: string
  name: string
  nameRu: string
  fromPercent: number | null
  toPercent: number | null
  dividendCalculation: string[]
  updatedAt: string
}

export function toProjectType(dto: ProjectTypeDto): ProjectType {
  return {
    id: dto.guid,
    name: dto.name_en,
    nameRu: dto.name_ru,
    fromPercent: dto.from_percent,
    toPercent: dto.to_percent,
    dividendCalculation: dto.calculate_dividend ?? [],
    updatedAt: dto.updated_at,
  }
}
