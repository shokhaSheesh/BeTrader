import type { Currency } from '@/shared/lib/format'

/** Raw row of the u-code `projects` table. Comments are the backend's own field labels. */
export interface ProjectDto {
  guid: string
  name_en: string
  name_ru: string
  name_uz: string
  ticker: string
  image: string | null
  /** MULTISELECT "Currency" */
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
  /** MULTISELECT "Status" */
  status: string[] | null
  /** "End time" */
  end_time: string | null
  /** "BOARD ORDER" */
  board_order: number | null
  /** "Created time" */
  created_time: string | null
  created_at: string
  updated_at: string
  project_types_id: string | null
  project_types_id_data: { guid: string; name_en: string; name_ru: string } | null
}

export interface Project {
  id: string
  name: string
  nameRu: string
  nameUz: string
  ticker: string
  imageUrl: string | null
  currencies: string[]
  /** Currency used to format this project's amounts */
  currency: Currency
  minimalAmount: number | null
  dividendAccrualPeriod: number | null
  maturityMonths: number | null
  insurance: boolean
  insuranceAmount: number | null
  holdWhileSelling: boolean
  holdOnInvestment: boolean
  statuses: string[]
  endTime: string | null
  typeId: string | null
  typeName: string | null
  boardOrder: number | null
  createdTime: string | null
  createdAt: string
  updatedAt: string
}

export function toProject(dto: ProjectDto): Project {
  return {
    id: dto.guid,
    name: dto.name_en,
    nameRu: dto.name_ru,
    nameUz: dto.name_uz,
    ticker: dto.ticker,
    imageUrl: dto.image || null,
    currencies: dto.currency ?? [],
    currency: dto.currency?.[0] === 'UZS' ? 'UZS' : 'USD',
    minimalAmount: dto.minimal_amount,
    dividendAccrualPeriod: dto.dividend_period,
    maturityMonths: dto.deposit_maturity_month,
    insurance: dto.insurance,
    insuranceAmount: dto.insurance_amount,
    holdWhileSelling: dto.sale,
    holdOnInvestment: dto.investment,
    statuses: dto.status ?? [],
    endTime: dto.end_time,
    typeId: dto.project_types_id,
    typeName: dto.project_types_id_data?.name_en ?? null,
    boardOrder: dto.board_order,
    createdTime: dto.created_time,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  }
}
