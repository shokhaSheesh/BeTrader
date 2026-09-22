import type { Currency } from '@/shared/lib/format'

/** Raw row of the u-code `projects` table. Labels in comments are the backend's own. */
export interface ProjectDto {
  guid: string
  name_en: string
  name_ru: string
  name_uz: string
  ticker: string
  image: string | null
  currency: string[] | null
  /** "Minimal amount (USD)" */
  minimal_amount: number | null
  /** "Dividend accrual period". Unit not defined by the backend */
  dividend_period: number | null
  /** "Maturity Month" */
  deposit_maturity_month: number | null
  /** "Insurance" */
  insurance: boolean
  /** "Insurance Amount (USD)" */
  insurance_amount: number | null
  /** "Hold while selling" */
  sale: boolean
  /** "Hold on investment" */
  investment: boolean
  /** MULTISELECT: labels come from GET /v2/fields/projects */
  status: string[] | null
  /** "End time" */
  end_time: string | null
  created_at: string
  project_types_id: string | null
  project_types_id_data: { guid: string; name_en: string; name_ru: string } | null
}

export interface Project {
  id: string
  name: string
  nameRu: string
  ticker: string
  imageUrl: string | null
  currency: Currency
  minimalAmount: number | null
  dividendAccrualPeriod: number | null
  maturityMonths: number | null
  statuses: string[]
  endTime: string | null
  typeName: string | null
}

export function toProject(dto: ProjectDto): Project {
  return {
    id: dto.guid,
    name: dto.name_en,
    nameRu: dto.name_ru,
    ticker: dto.ticker,
    imageUrl: dto.image || null,
    currency: dto.currency?.[0] === 'UZS' ? 'UZS' : 'USD',
    minimalAmount: dto.minimal_amount,
    dividendAccrualPeriod: dto.dividend_period,
    maturityMonths: dto.deposit_maturity_month,
    statuses: dto.status ?? [],
    endTime: dto.end_time,
    typeName: dto.project_types_id_data?.name_en ?? null,
  }
}
