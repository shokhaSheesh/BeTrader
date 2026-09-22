import type { InvestorJoin } from '@/shared/api/joins'

/** Raw row of the u-code `investor_score` table. */
export interface InvestorScoreDto {
  guid: string
  investors_id: string | null
  investors_id_data: InvestorJoin
  score: number | null
  created_at: string
  updated_at: string
}

export interface InvestorScore {
  id: string
  investorId: string | null
  score: number | null
  investorName: string | null
  investorPhone: string | null
  createdAt: string
  updatedAt: string
}

export const toInvestorScore = (d: InvestorScoreDto): InvestorScore => ({
  id: d.guid,
  investorId: d.investors_id || null,
  score: d.score,
  investorName: d.investors_id_data?.full_name || null,
  investorPhone: d.investors_id_data?.phone || null,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
