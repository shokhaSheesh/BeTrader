import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toProject } from '../model/types'

export const PROJECTS_TABLE = 'projects'

export const useProjectsQuery = (params: ListParams) =>
  useTableListQuery(PROJECTS_TABLE, params, toProject)

export const useProjectQuery = (id: string | undefined) =>
  useTableItemQuery(PROJECTS_TABLE, id, toProject)

/** Options for pickers. Projects are few, so the first 100 cover them all. */
export function useProjectOptions() {
  const query = useProjectsQuery({ page: 1, pageSize: 100 })
  return {
    ...query,
    options: (query.data?.items ?? []).map((p) => ({ value: p.id, label: p.name })),
  }
}
