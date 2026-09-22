import type { PolicyTypeJoin } from '@/shared/api/joins'

/** Raw row of the u-code `transaction_policy` table. */
export interface TransactionPolicyDto {
  guid: string
  policy_Type_id: string | null
  policy_Type_id_data: PolicyTypeJoin
  /** "Amount (USD)" in the backend, but count-type limits (e.g. 5 per month) use it too, so it is shown as a plain number */
  amount: number | null
  created_at: string
  updated_at: string
}

export interface TransactionPolicy {
  id: string
  policyTypeId: string | null
  amount: number | null
  policyTypeLabel: string | null
  createdAt: string
  updatedAt: string
}

export const toTransactionPolicy = (d: TransactionPolicyDto): TransactionPolicy => ({
  id: d.guid,
  policyTypeId: d.policy_Type_id || null,
  amount: d.amount,
  policyTypeLabel: d.policy_Type_id_data?.label_en || null,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
