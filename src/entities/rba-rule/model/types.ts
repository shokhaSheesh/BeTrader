/** Raw row of the u-code `rba_matrix` table. */
export interface RbaRuleDto {
  guid: string
  /** currency not stated */
  amount_from: number | null
  /** currency not stated */
  amount_to: number | null
  score: number | null
  created_at: string
  updated_at: string
}

export interface RbaRule {
  id: string
  amountFrom: number | null
  amountTo: number | null
  score: number | null
  createdAt: string
  updatedAt: string
}

export const toRbaRule = (d: RbaRuleDto): RbaRule => ({
  id: d.guid,
  amountFrom: d.amount_from,
  amountTo: d.amount_to,
  score: d.score,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
