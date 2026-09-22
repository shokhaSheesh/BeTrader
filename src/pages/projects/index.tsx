import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { PROJECTS_TABLE, useProjectsQuery, type Project } from '@/entities/project'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { useTableFields } from '@/shared/api/useTableFields'
import { useListParams } from '@/shared/hooks/useListParams'
import { formatDate, formatMoney, formatNumber } from '@/shared/lib/format'
import {
  Badge,
  ButtonLink,
  DataTable,
  FilterBar,
  ListEmptyState,
  PageHeader,
  Pagination,
  SearchInput,
  type Column,
} from '@/shared/ui'

const dash = <span className="text-fg-subtle">—</span>

// Headers follow the backend's field labels; values are shown as the backend sends them.
function buildColumns(optionLabel: (field: string, value: string) => string): Column<Project>[] {
  return [
    {
      id: 'name',
      header: 'Project',
      skeleton: 'w-40',
      cell: (p) => (
        <div className="flex items-center gap-3">
          {p.imageUrl ? (
            <img
              src={p.imageUrl}
              alt=""
              className="size-9 shrink-0 rounded-sm bg-surface-muted object-cover"
            />
          ) : (
            <span className="size-9 shrink-0 rounded-sm bg-surface-muted" />
          )}
          <div className="min-w-0">
            <div className="font-medium">{p.name}</div>
            <div className="text-xs text-fg-muted">{p.nameRu}</div>
          </div>
        </div>
      ),
    },
    { id: 'ticker', header: 'Ticker', skeleton: 'w-10', cell: (p) => p.ticker || dash },
    { id: 'type', header: 'Project type', cell: (p) => p.typeName ?? dash },
    {
      id: 'min',
      header: 'Minimal amount',
      align: 'right',
      cell: (p) => (p.minimalAmount != null ? formatMoney(p.minimalAmount, p.currency) : dash),
    },
    {
      id: 'maturity',
      header: 'Maturity, months',
      align: 'right',
      skeleton: 'w-8',
      cell: (p) => (p.maturityMonths != null ? formatNumber(p.maturityMonths) : dash),
    },
    {
      id: 'dividend-period',
      header: 'Dividend accrual period',
      align: 'right',
      skeleton: 'w-8',
      cell: (p) => (p.dividendAccrualPeriod != null ? formatNumber(p.dividendAccrualPeriod) : dash),
    },
    {
      id: 'status',
      header: 'Status',
      skeleton: 'w-20',
      cell: (p) =>
        p.statuses.length ? (
          <div className="flex gap-1.5">
            {p.statuses.map((s) => (
              <Badge key={s}>{optionLabel('status', s)}</Badge>
            ))}
          </div>
        ) : (
          dash
        ),
    },
    {
      id: 'end',
      header: 'End time',
      align: 'right',
      cell: (p) => (p.endTime ? formatDate(p.endTime) : dash),
    },
  ]
}

export default function ProjectsPage() {
  const list = useListParams()
  const query = useProjectsQuery({ page: list.page, pageSize: list.pageSize, search: list.search })
  const fields = useTableFields(PROJECTS_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<Project | null>(null)

  const columns = [
    ...buildColumns(fields.optionLabel),
    actionsColumn<Project>({
      onView: (p) => navigate(RECORDS.projects.detail(p.id)),
      onEdit: (p) => navigate(RECORDS.projects.edit(p.id)),
      onDelete: setToDelete,
    }),
  ]

  return (
    <>
      <PageHeader
        title="Projects"
        description="Investment products available to investors."
        actions={
          <ButtonLink to={RECORDS.projects.create} icon={Plus}>
            Create project
          </ButtonLink>
        }
      />

      <FilterBar>
        <SearchInput
          value={list.searchInput}
          onChange={list.setSearchInput}
          placeholder="Search projects"
        />
      </FilterBar>

      <DataTable
        columns={columns}
        rows={query.data?.items}
        getRowId={(p) => p.id}
        onRowClick={(p) => navigate(RECORDS.projects.detail(p.id))}
        loadingLabel="Loading projects…"
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        skeletonRows={3}
        emptyState={
          <ListEmptyState
            noun="projects"
            isError={query.isError}
            retrying={query.isFetching}
            onRetry={() => query.refetch()}
            search={list.search}
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
      <DeleteRecordDialog noun="project" target={toDelete} onClose={() => setToDelete(null)} />
    </>
  )
}
