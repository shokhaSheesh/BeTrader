import { useQuery } from '@tanstack/react-query'
import { authHttp } from '@/shared/api/http'
import { useSessionStore } from '@/shared/session/store'
import { toRole, type RoleDto } from '../model/types'

export const ROLES_TABLE = 'role'

interface RoleListResponse {
  data: { data: { count: number; response: RoleDto[] } }
}

/** All roles of the project (a handful): GET /v2/role on the auth API. */
export function useRolesQuery() {
  const projectId = useSessionStore((s) => s.session?.projectId)
  return useQuery({
    queryKey: ['roles', projectId],
    queryFn: async () => {
      const { data } = await authHttp.get<RoleListResponse>('/role', {
        params: { 'project-id': projectId },
      })
      return data.data.data.response.map(toRole)
    },
    enabled: !!projectId,
  })
}
