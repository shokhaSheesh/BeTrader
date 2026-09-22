import type { InvestorJoin, PolicyTypeJoin } from '@/shared/api/joins'

/** Raw row of the u-code `str_sar` table. */
export interface StrReportDto {
  guid: string
  /** "STR Date" (DATE_TIME) */
  date: string | null
  /** "Policy Type (cause)" */
  policy_Type_id: string | null
  policy_Type_id_data: PolicyTypeJoin
  /** currency not stated */
  last_transaction_amount: number | null
  /** "Investors" */
  investors_id: string | null
  investors_id_data: InvestorJoin
  /** "Passport": a link to an investor, shown by passport */
  investors_id_2: string | null
  investors_id_2_data: InvestorJoin
  created_at: string
  updated_at: string
}

export interface StrReport {
  id: string
  date: string | null
  policyTypeId: string | null
  lastTransactionAmount: number | null
  investorId: string | null
  passportInvestorId: string | null
  cause: string | null
  investorName: string | null
  investorPhone: string | null
  passport: string | null
  createdAt: string
  updatedAt: string
}

export const toStrReport = (d: StrReportDto): StrReport => ({
  id: d.guid,
  date: d.date || null,
  policyTypeId: d.policy_Type_id || null,
  lastTransactionAmount: d.last_transaction_amount,
  investorId: d.investors_id || null,
  passportInvestorId: d.investors_id_2 || null,
  cause: d.policy_Type_id_data?.label_en || null,
  investorName: d.investors_id_data?.full_name || null,
  investorPhone: d.investors_id_data?.phone || null,
  passport: d.investors_id_2_data?.passport || null,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
