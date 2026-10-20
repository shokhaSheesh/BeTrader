import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authHttp } from '@/shared/api/http'
import { assertWritable } from '@/shared/api/ucode'
import type { TablePermission } from '@/shared/permissions'
import { useSessionStore } from '@/shared/session/store'

// Roles live in u-code's auth API. The calls and bodies are the ones u-code's own admin sends
// (docs/API.md "Roles"): the project goes in the URL as `?project-id=` on every call (a body
// field is refused as "project id is an invalid uuid"). Roles and their permissions are per
// environment, so in Test these change Test's roles only; every call passes the write guard first.

type PermissionDraft = Map<string, TablePermission & { label: string }>

interface CreatedRole {
  data?: { guid?: string; id?: string; data?: { guid?: string } }
}

/** POST /v2/role: a new active role. Returns its id. */
async function createRole(projectId: string, name: string, clientTypeId: string) {
  assertWritable()
  const { data } = await authHttp.post<CreatedRole>(
    '/role',
    { name, status: true, client_type_id: clientTypeId },
    { params: { 'project-id': projectId } },
  )
  const id = data.data?.guid ?? data.data?.id ?? data.data?.data?.guid
  if (!id) throw new Error("The backend didn't return the new role's id")
  return id
}

interface PermissionRecord {
  data: { data: { tables: { slug: string; record_permissions: Record<string, string> }[] } }
}

/**
 * Saves a role's table rights the way u-code's admin does: read the role's whole permission
 * record, change only the read / write / update / delete flags, send the whole record back
 * (PUT /v2/role-permission/detailed). Menus and everything else stay as they were.
 */
async function saveTablePermissions(projectId: string, roleId: string, draft: PermissionDraft) {
  assertWritable()
  const { data } = await authHttp.get<PermissionRecord>(
    `/role-permission/detailed/${projectId}/${roleId}`,
    { params: { 'project-id': projectId } },
  )
  const record = data.data.data
  const yn = (v: boolean) => (v ? 'Yes' : 'No')
  for (const table of record.tables) {
    const want = draft.get(table.slug)
    if (!want) continue
    table.record_permissions = {
      ...table.record_permissions,
      read: yn(want.read),
      write: yn(want.create), // u-code's "write" is our "create"
      update: yn(want.update),
      delete: yn(want.delete),
    }
  }
  await authHttp.put(
    '/role-permission/detailed',
    { data: record, project_id: projectId, role_id: roleId },
    { params: { 'project-id': projectId } },
  )
}

/** DELETE /v2/role/{id} */
export async function deleteRole(id: string) {
  assertWritable()
  const projectId = useSessionStore.getState().session?.projectId
  await authHttp.delete(`/role/${id}`, { params: { 'project-id': projectId } })
}

const useRefresh = () => {
  const client = useQueryClient()
  return () =>
    Promise.all([
      client.invalidateQueries({ queryKey: ['roles'] }),
      client.invalidateQueries({ queryKey: ['permissions'] }),
    ])
}

/** Create a role, then give it the permissions picked on the form. Resolves to its id. */
export function useCreateRoleMutation() {
  const projectId = useSessionStore((s) => s.session?.projectId)
  const refresh = useRefresh()
  return useMutation({
    mutationFn: async (input: { name: string; clientTypeId: string; tables: PermissionDraft }) => {
      const id = await createRole(projectId!, input.name, input.clientTypeId)
      try {
        await saveTablePermissions(projectId!, id, input.tables)
      } catch (error) {
        // A new role starts with every permission ON (verified in Test). Never leave one like
        // that behind: undo the create, then report the failure.
        await deleteRole(id).catch(() => undefined)
        throw new Error(
          "The role's permissions couldn't be saved, so the role wasn't kept. Please try again.",
          { cause: error },
        )
      }
      return id
    },
    onSettled: refresh,
  })
}

export function useSaveRolePermissionsMutation(roleId: string | undefined) {
  const projectId = useSessionStore((s) => s.session?.projectId)
  const refresh = useRefresh()
  return useMutation({
    mutationFn: (tables: PermissionDraft) => saveTablePermissions(projectId!, roleId!, tables),
    onSettled: refresh,
  })
}

export function useDeleteRoleMutation() {
  const refresh = useRefresh()
  return useMutation({ mutationFn: deleteRole, onSettled: refresh })
}
