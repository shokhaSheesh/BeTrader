import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toStrReport } from '../model/types'

export const STR_SAR_TABLE = 'str_sar'

export const useStrReportsQuery = (params: ListParams) =>
  useTableListQuery(STR_SAR_TABLE, params, toStrReport)
export const useStrReportQuery = (id: string | undefined) =>
  useTableItemQuery(STR_SAR_TABLE, id, toStrReport)
