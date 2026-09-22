import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { ROLES_TABLE, useRolesQuery, type Role } from '@/entities/role'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { useLookupOptions } from '@/shared/api/useLookupOptions'
import { RECORDS } from '@/shared/config/routes'
import { Can } from '@/shared/permissions'
import {
  Badge,
  ButtonLink,
  DataTable,
  ListEmptyState,
  PageHeader,
  TextCell,
  type Column,
} from '@/shared/ui'

export default function RolesPage() {
  const query = useRolesQuery()
  const clientTypes = useLookupOptions('client_type', 'name')
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<Role | null>(null)
  const clientTypeName = (id: string | null) =>
    clientTypes.options.find((o) => o.value === id)?.label ?? null

  const columns: Column<Role>[] = [
    {
      id: 'name',
      header: 'Role',
      skeleton: 'w-40',
      cell: (r) => (
        <span className="flex items-center gap-2 font-medium">
          {r.name}
          {r.isSystem && <Badge>System</Badge>}
        </span>
      ),
    },
    {
      id: 'client_type',
      header: 'Client type',
      cell: (r) => <TextCell value={clientTypeName(r.clientTypeId)} />,
    },
    {
      id: 'status',
      header: 'Status',
      skeleton: 'w-16',
      cell: (r) => (r.isActive ? <Badge tone="success">Active</Badge> : <Badge>Inactive</Badge>),
    },
    actionsColumn<Role>({
      table: ROLES_TABLE,
      onView: (r) => navigate(RECORDS.roles.detail(r.id)),
      onEdit: (r) => navigate(RECORDS.roles.edit(r.id)),
      onDelete: setToDelete,
    }),
  ]

  return (
    <>
      <PageHeader
        title="Roles & permissions"
        description="What each role can see in the sidebar and do on each page."
        actions={
          <Can table={ROLES_TABLE} action="create">
            <ButtonLink to={RECORDS.roles.create} icon={Plus}>
              Create role
            </ButtonLink>
          </Can>
        }
      />
      <DataTable
        columns={columns}
        rows={query.data}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(RECORDS.roles.detail(r.id))}
        loading={query.isPending}
        fetching={query.isFetching}
        skeletonRows={8}
        loadingLabel="Loading roles"
        emptyState={
          <ListEmptyState
            noun="roles"
            isError={query.isError}
            retrying={query.isFetching}
            onRetry={() => query.refetch()}
            search=""
            onResetSearch={() => {}}
          />
        }
      />
      <DeleteRecordDialog
        noun="role"
        target={toDelete && { name: toDelete.name }}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
