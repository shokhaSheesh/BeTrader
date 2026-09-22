import { useParams } from 'react-router'
import { useRolesQuery } from '@/entities/role'
import { notWired } from '@/features/record-actions'
import { PermissionMatrix, usePermissionDraft } from '@/features/role-permissions'
import { RECORDS } from '@/shared/config/routes'
import { useRoleAccess } from '@/shared/permissions'
import { FormFooter, PageHeader, PageLoader } from '@/shared/ui'

/** Edits a role's table rights. Saving is PUT /v2/role-permission/detailed: not wired yet (writes are on hold). */
export default function RoleEditPage() {
  const { id } = useParams()
  const roles = useRolesQuery()
  const access = useRoleAccess(id)
  const role = roles.data?.find((r) => r.id === id)
  const draft = usePermissionDraft(access.tables)

  if (roles.isPending || access.isPending || !draft.tables)
    return <PageLoader label="Loading role" />

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        notWired('save')
      }}
    >
      <PageHeader
        back={{ to: RECORDS.roles.detail(id!), label: role?.name ?? 'Role' }}
        title={`Edit permissions${role ? `: ${role.name}` : ''}`}
      />
      <PermissionMatrix
        tables={draft.tables}
        onToggle={draft.toggle}
        onToggleColumn={draft.setColumn}
      />
      <FormFooter cancelTo={RECORDS.roles.detail(id!)} submitLabel="Save permissions" />
    </form>
  )
}
