import type { InvestorJoin } from '@/shared/api/joins'

/**
 * Raw row of the u-code `referral_links` table.
 */
export interface ReferralLinkDto {
  guid: string
  /** "Send Investor Unique ID" */
  send_investor_u_id: string | null
  /** "Send Investor Phone" */
  send_phone_number: string | null
  /** "Entered Investor Phone" */
  entered_phone_number: string | null
  /** "Is Active" */
  is_active: boolean | null
  /** DATE_TIME */
  send_at: string | null
  /** DATE_TIME: when the invited person registered */
  register_date: string | null
  /** "Send Investor" (who shared the link) */
  investors_id: string | null
  investors_id_data: InvestorJoin
  /** "Entered Investor" (who joined through it) */
  investors_id_2: string | null
  investors_id_2_data: InvestorJoin
  /** "Bonus transaction ID" */
  transactions_id: string | null
  /** "1-st investment transaction ID" */
  transactions_id_2: string | null
  created_at: string
  updated_at: string
}

export interface ReferralLink {
  id: string
  sendInvestorUId: string | null
  sendPhoneNumber: string | null
  enteredPhoneNumber: string | null
  isActive: boolean | null
  sendAt: string | null
  registerDate: string | null
  investorsId: string | null
  investorsId2: string | null
  transactionsId: string | null
  transactionsId2: string | null
  senderName: string | null
  enteredName: string | null
  createdAt: string
  updatedAt: string
}

export const toReferralLink = (d: ReferralLinkDto): ReferralLink => ({
  id: d.guid,
  sendInvestorUId: d.send_investor_u_id || null,
  sendPhoneNumber: d.send_phone_number || null,
  enteredPhoneNumber: d.entered_phone_number || null,
  isActive: d.is_active,
  sendAt: d.send_at || null,
  registerDate: d.register_date || null,
  investorsId: d.investors_id || null,
  investorsId2: d.investors_id_2 || null,
  transactionsId: d.transactions_id || null,
  transactionsId2: d.transactions_id_2 || null,
  senderName: d.investors_id_data?.full_name || null,
  enteredName: d.investors_id_2_data?.full_name || null,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
