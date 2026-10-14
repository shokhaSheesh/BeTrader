/** Raw row of the u-code `project_investors` table. */
export interface ProjectInvestorDto {
  guid: string
  /** "Investment". Currency not stated by the backend */
  investment: number | null
  /** "Interest income". Currency not stated by the backend */
  dividend: number | null
  investors_id: string | null
  /**
   * The backend joins the WHOLE investor record here (passport, PINFL, pin_code, push token…).
   * We read only what the admin needs (name, phone, passport); see the open question in docs/API.md.
   */
  investors_id_data: {
    full_name: string | null
    phone: string | null
    passport: string | null
  } | null
  projects_id: string | null
  projects_id_data: { name_en: string | null } | null
  // Fields only the Test environment has so far (absent in Production rows)
  investment_uzs?: number | null
  dividend_uzs?: number | null
  status?: string | null
  closing_date?: string | null
  created_time: string
  updated_time: string
}

export interface ProjectInvestor {
  id: string
  investorId: string | null
  investorName: string | null
  investorPhone: string | null
  investorPassport: string | null
  projectId: string | null
  projectName: string | null
  investment: number | null
  interestIncome: number | null
  investmentUzs: number | null
  interestIncomeUzs: number | null
  /** Free text in the backend (e.g. "active"), shown as sent */
  status: string | null
  closingDate: string | null
  createdTime: string
  updatedTime: string
}

export function toProjectInvestor(dto: ProjectInvestorDto): ProjectInvestor {
  return {
    id: dto.guid,
    investorId: dto.investors_id,
    investorName: dto.investors_id_data?.full_name ?? null,
    investorPhone: dto.investors_id_data?.phone ?? null,
    investorPassport: dto.investors_id_data?.passport || null,
    projectId: dto.projects_id,
    projectName: dto.projects_id_data?.name_en ?? null,
    investment: dto.investment,
    interestIncome: dto.dividend,
    investmentUzs: dto.investment_uzs ?? null,
    interestIncomeUzs: dto.dividend_uzs ?? null,
    status: dto.status || null,
    closingDate: dto.closing_date ?? null,
    createdTime: dto.created_time,
    updatedTime: dto.updated_time,
  }
}
