import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getTableItems, type ListParams } from '@/shared/api/ucode'
import { toProjectType, type ProjectTypeDto } from '../model/types'

export const PROJECT_TYPES_TABLE = 'project_types'

export const projectTypeKeys = {
  all: ['project-types'] as const,
  list: (params: ListParams) => [...projectTypeKeys.all, 'list', params] as const,
}

export function useProjectTypesQuery(params: ListParams) {
  return useQuery({
    queryKey: projectTypeKeys.list(params),
    queryFn: async () => {
      const result = await getTableItems<ProjectTypeDto>(PROJECT_TYPES_TABLE, params)
      return { ...result, items: result.items.map(toProjectType) }
    },
    placeholderData: keepPreviousData,
  })
}
