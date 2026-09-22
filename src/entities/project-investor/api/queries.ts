import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toProjectInvestor } from '../model/types'

export const PROJECT_INVESTORS_TABLE = 'project_investors'

export const useProjectInvestorsQuery = (params: ListParams) =>
  useTableListQuery(PROJECT_INVESTORS_TABLE, params, toProjectInvestor)

export const useProjectInvestorQuery = (id: string | undefined) =>
  useTableItemQuery(PROJECT_INVESTORS_TABLE, id, toProjectInvestor)
