import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useProjectOptions } from '@/entities/project'
import { Plus } from 'lucide-react'
import {
  PROJECT_INVESTORS_TABLE,
  useProjectInvestorsQuery,
  type ProjectInvestor,
} from '@/entities/project-investor'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { dateRangeFilter, equalsFilter } from '@/shared/api/filters'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { Can } from '@/shared/permissions'
import { useListParams } from '@/shared/hooks/useListParams'
import { formatAmount, formatPhone } from '@/shared/lib/format'
import {
  ButtonLink,
  CodeCell,
  Dash,
  DataTable,
  DateTimeCell,
  TextCell,
  DateRangeFilter,
  FilterBar,
  FilterSelect,
  ListEmptyState,
  PageHeader,
  Pagination,
  type Column,
} from '@/shared/ui'

const FILTER_KEYS = ['project', 'from', 'to'] as const

// Investment and interest income carry no currency in the backend, so none is shown (DESIGN.md §0).
function buildColumns(label: (field: string) => string): Column<ProjectInvestor>[] {
  return [
    {
      id: 'investor',
      header: label('investors_id'),
      skeleton: 'w-40',
      cell: (r) => (
        <span className="font-medium">
          <TextCell value={r.investorName} />
        </span>
      ),
    },
    {
      id: 'phone',
      header: 'Phone',
      skeleton: 'w-32',
      cell: (r) => <CodeCell value={r.investorPhone && formatPhone(r.investorPhone)} />,
    },
    { id: 'passport', header: 'Passport', cell: (r) => <CodeCell value={r.investorPassport} /> },
    {
      id: 'project',
      header: label('projects_id'),
      cell: (r) => <TextCell value={r.projectName} />,
    },
    {
      id: 'investment',
      header: label('investment'),
      align: 'right',
      cell: (r) => (r.investment != null ? formatAmount(r.investment) : <Dash />),
    },
    {
      id: 'dividend',
      header: label('dividend'),
      align: 'right',
      cell: (r) => (r.interestIncome != null ? formatAmount(r.interestIncome) : <Dash />),
    },
    {
      id: 'created_time',
      header: label('created_time'),
      align: 'right',
      skeleton: 'w-32',
      cell: (r) => <DateTimeCell value={r.createdTime} />,
    },
    {
      id: 'updated_time',
      header: label('updated_time'),
      align: 'right',
      skeleton: 'w-32',
      cell: (r) => <DateTimeCell value={r.updatedTime} />,
    },
  ]
}

export default function ProjectInvestorsPage() {
  const list = useListParams(FILTER_KEYS)
  // No search box: the backend ignores `search` on this table (docs/API.md, open questions).
  // Filters work and run on the backend.
  const projects = useProjectOptions()
  const filters = {
    ...equalsFilter('projects_id', list.filter('project')),
    ...dateRangeFilter('created_time', list.filter('from'), list.filter('to')),
  }
  const query = useProjectInvestorsQuery({
    page: list.page,
    pageSize: list.pageSize,
    filters,
    order: { created_time: -1 },
  })
  const fields = useTableFields(PROJECT_INVESTORS_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<ProjectInvestor | null>(null)

  const columns = [
    ...buildColumns(fields.fieldLabel),
    actionsColumn<ProjectInvestor>({
      table: PROJECT_INVESTORS_TABLE,
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
          <Can table={PROJECT_INVESTORS_TABLE} action="create">
            <ButtonLink to={RECORDS.projectInvestors.create} icon={Plus}>
              Add investment
            </ButtonLink>
          </Can>
        }
      />

      <FilterBar active={list.hasFilters} onReset={list.resetAll}>
        <FilterSelect
          label={fields.fieldLabel('projects_id')}
          value={list.filter('project')}
          onChange={(v) => list.setFilters({ project: v })}
          options={projects.options}
        />
        <DateRangeFilter
          label={fields.fieldLabel('created_time')}
          from={list.filter('from')}
          to={list.filter('to')}
          onChange={({ from, to }) => list.setFilters({ from, to })}
        />
      </FilterBar>

      <DataTable
        columns={columns}
        rows={query.data?.items}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(RECORDS.projectInvestors.detail(r.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading project investors"
        emptyState={
          <ListEmptyState
            noun="project investors"
            isError={query.isError}
            retrying={query.isFetching}
            onRetry={() => query.refetch()}
            search=""
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
