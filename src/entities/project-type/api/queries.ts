import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toProjectType } from '../model/types'

export const PROJECT_TYPES_TABLE = 'project_types'

export const useProjectTypesQuery = (params: ListParams) =>
  useTableListQuery(PROJECT_TYPES_TABLE, params, toProjectType)

export const useProjectTypeQuery = (id: string | undefined) =>
  useTableItemQuery(PROJECT_TYPES_TABLE, id, toProjectType)

export function useProjectTypeOptions() {
  const query = useProjectTypesQuery({ page: 1, pageSize: 100 })
  return {
    ...query,
    options: (query.data?.items ?? []).map((t) => ({ value: t.id, label: t.name })),
  }
}
