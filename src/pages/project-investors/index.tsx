import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import {
  PROJECT_INVESTORS_TABLE,
  useProjectInvestorsQuery,
  type ProjectInvestor,
} from '@/entities/project-investor'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { useListParams } from '@/shared/hooks/useListParams'
import { formatAmount, formatDateTime, formatPhone } from '@/shared/lib/format'
import {
  ButtonLink,
  DataTable,
  ListEmptyState,
  PageHeader,
  Pagination,
  type Column,
} from '@/shared/ui'

const dash = <span className="text-fg-subtle">—</span>

// Investment and interest income carry no currency in the backend, so none is shown (DESIGN.md §0).
function buildColumns(label: (field: string) => string): Column<ProjectInvestor>[] {
  return [
    {
      id: 'investor',
      header: label('investors_id'),
      skeleton: 'w-40',
      cell: (r) => (
        <div>
          <div className="font-medium">{r.investorName ?? dash}</div>
          {r.investorPhone && (
            <div className="num text-xs text-fg-muted">{formatPhone(r.investorPhone)}</div>
          )}
        </div>
      ),
    },
    { id: 'project', header: label('projects_id'), cell: (r) => r.projectName ?? dash },
    {
      id: 'investment',
      header: label('investment'),
      align: 'right',
      cell: (r) => (r.investment != null ? formatAmount(r.investment) : dash),
    },
    {
      id: 'dividend',
      header: label('dividend'),
      align: 'right',
      cell: (r) => (r.interestIncome != null ? formatAmount(r.interestIncome) : dash),
    },
    {
      id: 'created',
      header: label('created_time'),
      align: 'right',
      skeleton: 'w-32',
      cell: (r) => formatDateTime(r.createdTime),
    },
  ]
}

export default function ProjectInvestorsPage() {
  const list = useListParams()
  const query = useProjectInvestorsQuery({
    page: list.page,
    pageSize: list.pageSize,
    search: list.search,
  })
  const fields = useTableFields(PROJECT_INVESTORS_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<ProjectInvestor | null>(null)

  const columns = [
    ...buildColumns(fields.fieldLabel),
    actionsColumn<ProjectInvestor>({
      onView: (r) => navigate(RECORDS.projectInvestors.detail(r.id)),
      onEdit: (r) => navigate(RECORDS.projectInvestors.edit(r.id)),
      onDelete: setToDelete,
    }),
  ]

  return (
    <>
      <PageHeader
        title="Project investors"
        description="Who invested in which project, and how much."
        actions={
          <ButtonLink to={RECORDS.projectInvestors.create} icon={Plus}>
            Add investment
          </ButtonLink>
        }
      />

      <DataTable
        columns={columns}
        rows={query.data?.items}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(RECORDS.projectInvestors.detail(r.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading project investors…"
        emptyState={
          <ListEmptyState
            noun="project investors"
            isError={query.isError}
            retrying={query.isFetching}
            onRetry={() => query.refetch()}
            search=""
            onResetSearch={list.resetSearch}
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
        noun="investment"
        target={
          toDelete && {
            name: `${toDelete.investorName ?? 'Investor'} in ${toDelete.projectName ?? 'project'}`,
          }
        }
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
