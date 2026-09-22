import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { EMPLOYEES_TABLE, useEmployeesQuery, type Employee } from '@/entities/employee'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { Can } from '@/shared/permissions'
import { useListParams } from '@/shared/hooks/useListParams'
import {
  Badge,
  ButtonLink,
  DataTable,
  DateTimeCell,
  FilterBar,
  ImageCell,
  ListEmptyState,
  PageHeader,
  Pagination,
  SearchInput,
  TextCell,
  type Column,
} from '@/shared/ui'

// `password` (hashed) and `user_id_auth` are sent by the backend but never shown (docs/API.md).
function buildColumns(label: (f: string) => string): Column<Employee>[] {
  return [
    {
      id: 'login',
      header: label('login'),
      skeleton: 'w-44',
      cell: (r) => (
        <span className="flex items-center gap-3">
          <ImageCell src={r.photo} round size={32} />
          <span className="num font-medium">{r.login ?? '—'}</span>
        </span>
      ),
    },
    {
      id: 'role_id',
      header: label('role_id'),
      skeleton: 'w-28',
      cell: (r) => (r.role ? <Badge>{r.role}</Badge> : <TextCell value={null} />),
    },
    {
      id: 'client_type_id',
      header: label('client_type_id'),
      cell: (r) => <TextCell value={r.clientType} />,
    },
    {
      id: 'created_at',
      header: 'Created',
      align: 'right',
      skeleton: 'w-32',
      cell: (r) => <DateTimeCell value={r.createdAt} />,
    },
    {
      id: 'updated_at',
      header: 'Last updated',
      align: 'right',
      skeleton: 'w-32',
      cell: (r) => <DateTimeCell value={r.updatedAt} />,
    },
  ]
}

export default function EmployeesPage() {
  const list = useListParams()
  const fields = useTableFields(EMPLOYEES_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<Employee | null>(null)
  const query = useEmployeesQuery({ page: list.page, pageSize: list.pageSize, search: list.search })

  return (
    <>
      <PageHeader
        title="Employees"
        description="Staff accounts that can sign in to the admin."
        actions={
          <Can table={EMPLOYEES_TABLE} action="create">
            <ButtonLink to={RECORDS.employees.create} icon={Plus}>
              Add employee
            </ButtonLink>
          </Can>
        }
      />
      <FilterBar active={!!list.search} onReset={list.resetAll}>
        <SearchInput
          value={list.searchInput}
          onChange={list.setSearchInput}
          placeholder="Search by login"
        />
      </FilterBar>
      <DataTable
        columns={[
          ...buildColumns(fields.fieldLabel),
          actionsColumn<Employee>({
            table: EMPLOYEES_TABLE,
            onView: (r) => navigate(RECORDS.employees.detail(r.id)),
            onEdit: (r) => navigate(RECORDS.employees.edit(r.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(RECORDS.employees.detail(r.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        skeletonRows={5}
        loadingLabel="Loading employees"
        emptyState={
          <ListEmptyState
            noun="employees"
            isError={query.isError}
            retrying={query.isFetching}
            onRetry={() => query.refetch()}
            search={list.search}
            onResetSearch={list.resetAll}
          />
        }
        footer={
          query.data && (
            <Pagination
              page={list.page}
              pageSize={list.pageSize}
              total={query.data.total}
              onPageChange={list.setPage}
              onPageSizeChange={list.setPageSize}
            />
          )
        }
      />
      <DeleteRecordDialog
        noun="employee"
        target={toDelete && { name: toDelete.login ?? 'This employee' }}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
