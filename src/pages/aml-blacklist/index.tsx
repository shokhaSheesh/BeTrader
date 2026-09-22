import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import {
  BLACKLIST_TABLE,
  useBlacklistEntriesQuery,
  type BlacklistEntry,
} from '@/entities/blacklist-entry'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { Can } from '@/shared/permissions'
import { useListParams } from '@/shared/hooks/useListParams'
import {
  ButtonLink,
  CodeCell,
  type Column,
  DataTable,
  DateTimeCell,
  FilterBar,
  ListEmptyState,
  PageHeader,
  Pagination,
  SearchInput,
  TextCell,
} from '@/shared/ui'

function buildColumns(label: (f: string) => string): Column<BlacklistEntry>[] {
  return [
    {
      id: 'name',
      header: label('name'),
      skeleton: 'w-56',
      cell: (r) => (
        <span className="font-medium">
          <TextCell value={r.name} />
        </span>
      ),
    },
    { id: 'surname', header: label('surname'), cell: (r) => <TextCell value={r.surname} /> },
    { id: 'passport', header: label('passport'), cell: (r) => <CodeCell value={r.passport} /> },
    { id: 'pin', header: label('pin'), skeleton: 'w-32', cell: (r) => <CodeCell value={r.pin} /> },
    {
      id: 'created_at',
      header: 'Added',
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

export default function Page() {
  const list = useListParams([])
  const fields = useTableFields(BLACKLIST_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<BlacklistEntry | null>(null)
  const query = useBlacklistEntriesQuery({
    page: list.page,
    pageSize: list.pageSize,
    search: list.search,
  })

  return (
    <>
      <PageHeader
        title="AML blacklist"
        description="People who must not be onboarded or transacted with."
        actions={
          <Can table={BLACKLIST_TABLE} action="create">
            <ButtonLink to={RECORDS.amlBlacklist.create} icon={Plus}>
              Add to blacklist
            </ButtonLink>
          </Can>
        }
      />
      <FilterBar active={!!list.search || list.hasFilters} onReset={list.resetAll}>
        <SearchInput
          value={list.searchInput}
          onChange={list.setSearchInput}
          placeholder="Name, passport or PIN"
        />
      </FilterBar>
      <DataTable
        columns={[
          ...buildColumns(fields.fieldLabel),
          actionsColumn<BlacklistEntry>({
            table: BLACKLIST_TABLE,
            onView: (r) => navigate(RECORDS.amlBlacklist.detail(r.id)),
            onEdit: (r) => navigate(RECORDS.amlBlacklist.edit(r.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(RECORDS.amlBlacklist.detail(r.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading blacklist entries"
        emptyState={
          <ListEmptyState
            noun="blacklist entries"
            isError={query.isError}
            retrying={query.isFetching}
            onRetry={() => query.refetch()}
            search={list.search}
            filtered={list.hasFilters}
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
        noun="entry"
        target={toDelete && { name: toDelete.name ?? toDelete.passport ?? 'This entry' }}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
