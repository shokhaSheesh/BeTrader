import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toBitrixLead } from '../model/types'

export const BITRIX_LEADS_TABLE = 'bitrix_leads'

export const useBitrixLeadsQuery = (params: ListParams) =>
  useTableListQuery(BITRIX_LEADS_TABLE, params, toBitrixLead)
export const useBitrixLeadQuery = (id: string | undefined) =>
  useTableItemQuery(BITRIX_LEADS_TABLE, id, toBitrixLead)
