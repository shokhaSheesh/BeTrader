import type { InvestorJoin } from '@/shared/api/joins'

/**
 * Raw row of the u-code `bitrix_leads` table.
 */
export interface BitrixLeadDto {
  guid: string
  /** free text: error / created / deposit_updated */
  status: string | null
  lead_type: string | null
  /** "Mitrix method" (sic) */
  bitrix_method: string | null
  http_status: number | null
  bitrix_lead_id: string | null
  phone: string | null
  /** MULTI_LINE */
  error: string | null
  /** MULTI_LINE (JSON) */
  request_body: string | null
  /** MULTI_LINE (JSON) */
  response_body: string | null
  deposit_synced: boolean | null
  investors_id: string | null
  investors_id_data: InvestorJoin
  created_at: string
  updated_at: string
}

export interface BitrixLead {
  id: string
  status: string | null
  leadType: string | null
  bitrixMethod: string | null
  httpStatus: number | null
  bitrixLeadId: string | null
  phone: string | null
  error: string | null
  requestBody: string | null
  responseBody: string | null
  depositSynced: boolean | null
  investorsId: string | null
  investorName: string | null
  createdAt: string
  updatedAt: string
}

export const toBitrixLead = (d: BitrixLeadDto): BitrixLead => ({
  id: d.guid,
  status: d.status || null,
  leadType: d.lead_type || null,
  bitrixMethod: d.bitrix_method || null,
  httpStatus: d.http_status,
  bitrixLeadId: d.bitrix_lead_id || null,
  phone: d.phone || null,
  error: d.error || null,
  requestBody: d.request_body || null,
  responseBody: d.response_body || null,
  depositSynced: d.deposit_synced,
  investorsId: d.investors_id || null,
  investorName: d.investors_id_data?.full_name || null,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
