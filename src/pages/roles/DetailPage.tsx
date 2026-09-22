import { useState } from 'react'
import { useParams } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { ROLES_TABLE, useRolesQuery } from '@/entities/role'
import { DeleteRecordDialog } from '@/features/record-actions'
import { PermissionMatrix } from '@/features/role-permissions'
import { NAVIGATION } from '@/shared/config/navigation'
import { RECORDS } from '@/shared/config/routes'
import { Can, useRoleAccess } from '@/shared/permissions'
import { Badge, Button, ButtonLink, EmptyState, PageHeader, PageLoader } from '@/shared/ui'

export default function RoleDetailPage() {
  const { id } = useParams()
  const roles = useRolesQuery()
  const access = useRoleAccess(id)
  const [deleting, setDeleting] = useState(false)
  const role = roles.data?.find((r) => r.id === id)
  const back = { to: RECORDS.roles.list, label: 'Roles & permissions' }

  if (roles.isPending || access.isPending) return <PageLoader label="Loading role" />
  if (!role || access.isError) {
    return (
      <>
        <PageHeader back={back} title="Role" />
        <div className="rounded-md border border-line bg-surface">
          <EmptyState
            variant={access.isError ? 'error' : 'no-results'}
            title={access.isError ? "Couldn't load this role" : "This role doesn't exist"}
          />
        </div>
      </>
    )
  }

  // The sidebar exactly as this role will see it (same rules the app enforces).
  const sections = NAVIGATION.flatMap((e) => {
    const leaves = e.kind === 'link' ? [e] : e.items
    const visible = leaves.filter((l) => access.canSee(l.resource))
    return visible.length ? [{ title: e.label, pages: visible.map((l) => l.label) }] : []
  })

  return (
    <>
      <PageHeader
        back={back}
        title={
          <span className="flex items-center gap-3">
            {role.name}
            {role.isSystem && <Badge>System</Badge>}
            {role.isActive ? <Badge tone="success">Active</Badge> : <Badge>Inactive</Badge>}
          </span>
        }
        actions={
          <>
            <Can table={ROLES_TABLE} action="delete">
              <Button variant="danger-ghost" icon={Trash2} onClick={() => setDeleting(true)}>
                Delete
              </Button>
            </Can>
            <Can table={ROLES_TABLE} action="update">
              <ButtonLink to={RECORDS.roles.edit(role.id)} icon={Pencil}>
                Edit permissions
              </ButtonLink>
            </Can>
          </>
        }
      />
      <div className="flex flex-col gap-6">
        <section className="rounded-md border border-line bg-surface">
          <h2 className="border-b border-line px-6 py-4 text-base font-semibold">Sidebar</h2>
          <div className="p-6">
            {sections.length ? (
              <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
                {sections.map((s) => (
                  <div key={s.title}>
                    <p className="text-xs text-fg-muted">{s.title}</p>
                    <p className="mt-1">{s.pages.join(', ')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-fg-muted">This role sees no pages.</p>
            )}
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">Table permissions</h2>
          {access.tables && <PermissionMatrix tables={access.tables} />}
        </section>
      </div>
      <DeleteRecordDialog
        noun="role"
        target={deleting ? { name: role.name } : null}
        onClose={() => setDeleting(false)}
      />
    </>
  )
}
