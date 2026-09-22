import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getTableItems, type ListParams } from '@/shared/api/ucode'
import { toProject, type ProjectDto } from '../model/types'

export const PROJECTS_TABLE = 'projects'

export const projectKeys = {
  all: ['projects'] as const,
  list: (params: ListParams) => [...projectKeys.all, 'list', params] as const,
}

export function useProjectsQuery(params: ListParams) {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: async () => {
      const result = await getTableItems<ProjectDto>(PROJECTS_TABLE, params)
      return { ...result, items: result.items.map(toProject) }
    },
    placeholderData: keepPreviousData,
  })
}
