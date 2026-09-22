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
   * We read only what the admin needs; see the open question in docs/API.md.
   */
  investors_id_data: { full_name: string | null; phone: string | null } | null
  projects_id: string | null
  projects_id_data: { name_en: string | null } | null
  created_time: string
  updated_time: string
}

export interface ProjectInvestor {
  id: string
  investorId: string | null
  investorName: string | null
  investorPhone: string | null
  projectId: string | null
  projectName: string | null
  investment: number | null
  interestIncome: number | null
  createdTime: string
  updatedTime: string
}

export function toProjectInvestor(dto: ProjectInvestorDto): ProjectInvestor {
  return {
    id: dto.guid,
    investorId: dto.investors_id,
    investorName: dto.investors_id_data?.full_name ?? null,
    investorPhone: dto.investors_id_data?.phone ?? null,
    projectId: dto.projects_id,
    projectName: dto.projects_id_data?.name_en ?? null,
    investment: dto.investment,
    interestIncome: dto.dividend,
    createdTime: dto.created_time,
    updatedTime: dto.updated_time,
  }
}
