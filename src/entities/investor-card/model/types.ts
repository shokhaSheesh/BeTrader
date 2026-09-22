/**
 * Raw row of the u-code `investor_cards` table.
 * `card_token` (a payment token) is deliberately NOT mapped: it's a secret and is never shown.
 */
export interface InvestorCardDto {
  guid: string
  /** "Card number": already masked by the backend (e.g. 860000******1234) */
  masked_pan: string | null
  /** "Card Name" */
  card_name: string | null
  /** "Type": free text (Humo, Uzcard…); no options defined in the backend */
  type: string | null
  /** "Expiry date" (DATE) */
  expiry_date: string | null
  investors_id: string | null
  investors_id_data: { full_name: string | null; phone: string | null } | null
  created_time: string | null
  created_at: string
  updated_at: string
}

export interface InvestorCard {
  id: string
  maskedPan: string | null
  cardName: string | null
  type: string | null
  expiryDate: string | null
  investorId: string | null
  investorName: string | null
  investorPhone: string | null
  createdTime: string | null
  updatedAt: string
}

export function toInvestorCard(dto: InvestorCardDto): InvestorCard {
  return {
    id: dto.guid,
    maskedPan: dto.masked_pan || null,
    cardName: dto.card_name || null,
    type: dto.type || null,
    expiryDate: dto.expiry_date || null,
    investorId: dto.investors_id,
    investorName: dto.investors_id_data?.full_name || null,
    investorPhone: dto.investors_id_data?.phone || null,
    createdTime: dto.created_time ?? dto.created_at,
    updatedAt: dto.updated_at,
  }
}
