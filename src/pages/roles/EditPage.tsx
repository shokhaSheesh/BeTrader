import { useNavigate, useParams } from 'react-router'
import { useRolesQuery, useSaveRolePermissionsMutation } from '@/entities/role'
import { PermissionMatrix, usePermissionDraft } from '@/features/role-permissions'
import { backendMessage } from '@/shared/api/errors'
import { RECORDS } from '@/shared/config/routes'
import { toast } from '@/shared/lib/toast'
import { useRoleAccess } from '@/shared/permissions'
import { FormActions, PageHeader, PageLoader } from '@/shared/ui'

/** Edits a role's table rights. Saving is PUT /v2/role-permission/detailed (auth API). */
export default function RoleEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const roles = useRolesQuery()
  const save = useSaveRolePermissionsMutation(id)
  const access = useRoleAccess(id)
  const role = roles.data?.find((r) => r.id === id)
  const draft = usePermissionDraft(access.tables)

  if (roles.isPending || access.isPending || !draft.tables)
    return <PageLoader label="Loading role" />

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (!draft.tables) return
        save.mutate(draft.tables, {
          onSuccess: () => {
            toast.success('Permissions saved')
            navigate(RECORDS.roles.detail(id!), { replace: true })
          },
          onError: (error) =>
            toast.error("Couldn't save the permissions", backendMessage(error) ?? error.message),
        })
      }}
    >
      <PageHeader
        back={{ to: RECORDS.roles.detail(id!), label: role?.name ?? 'Role' }}
        title={`Edit permissions${role ? `: ${role.name}` : ''}`}
      />
      <FormActions
        cancelTo={RECORDS.roles.detail(id!)}
        submitLabel="Save permissions"
        submitting={save.isPending}
      />
      <PermissionMatrix
        tables={draft.tables}
        onToggle={draft.toggle}
        onToggleColumn={draft.setColumn}
      />
    </form>
  )
}
