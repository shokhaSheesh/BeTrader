import type { PolicyTypeJoin } from '@/shared/api/joins'

/** Raw row of the u-code `transaction_policy` table. */
export interface TransactionPolicyDto {
  guid: string
  policy_Type_id: string | null
  policy_Type_id_data: PolicyTypeJoin
  /**
   * The same field as returned by a single-record read: u-code lowercases the key there
   * (`policy_type_id`) and leaves `policy_Type_id_data` empty (verified 2026-10-20)
   */
  policy_type_id?: string | null
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
  policyTypeId: d.policy_Type_id || d.policy_type_id || null,
  amount: d.amount,
  policyTypeLabel: d.policy_Type_id_data?.label_en || null,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
