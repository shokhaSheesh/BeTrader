import { useState } from 'react'
import { useParams } from 'react-router'
import { useRolesQuery } from '@/entities/role'
import { notWired } from '@/features/record-actions'
import { PermissionMatrix } from '@/features/role-permissions'
import { RECORDS } from '@/shared/config/routes'
import { useRoleAccess, type Action, type TablePermission } from '@/shared/permissions'
import { FormFooter, PageHeader, PageLoader } from '@/shared/ui'

type Tables = Map<string, TablePermission & { label: string }>

/** Edits a role's table rights. Saving is PUT /v2/role-permission/detailed: not wired yet (writes are on hold). */
export default function RoleEditPage() {
  const { id } = useParams()
  const roles = useRolesQuery()
  const access = useRoleAccess(id)
  const role = roles.data?.find((r) => r.id === id)
  const [draft, setDraft] = useState<Tables | null>(null)
  const tables = draft ?? access.tables

  if (roles.isPending || access.isPending || !tables) return <PageLoader label="Loading role" />

  const toggle = (slug: string, action: Action) => {
    const next: Tables = new Map(tables)
    const t = next.get(slug)!
    next.set(slug, { ...t, [action]: !t[action] })
    setDraft(next)
  }

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
      <PermissionMatrix tables={tables} onToggle={toggle} />
      <FormFooter cancelTo={RECORDS.roles.detail(id!)} submitLabel="Save permissions" />
    </form>
  )
}
