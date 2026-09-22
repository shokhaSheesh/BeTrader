import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { PROJECTS_TABLE, useProjectsQuery, type Project } from '@/entities/project'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { multiFilter } from '@/shared/api/filters'
import { useTableFields } from '@/shared/api/useTableFields'
import { useListParams } from '@/shared/hooks/useListParams'
import { formatMoney } from '@/shared/lib/format'
import {
  ButtonLink,
  CodeCell,
  Dash,
  DateCell,
  DateTimeCell,
  ImageCell,
  NumberCell,
  OptionsCell,
  TextCell,
  YesNoCell,
  DataTable,
  FilterBar,
  FilterMultiSelect,
  ListEmptyState,
  PageHeader,
  Pagination,
  SearchInput,
  type Column,
} from '@/shared/ui'

// Headers follow the backend's field labels; values are shown as the backend sends them.
// Every field of the `projects` table; headers are the backend's labels.
function buildColumns(
  label: (f: string) => string,
  optionLabel: (field: string, value: string) => string,
): Column<Project>[] {
  const opt = (field: string) => (v: string) => optionLabel(field, v)
  return [
    {
      id: 'name_en',
      header: label('name_en'),
      skeleton: 'w-40',
      cell: (p) => (
        <span className="flex items-center gap-3">
          <ImageCell src={p.imageUrl} />
          <span className="font-medium">
            <TextCell value={p.name} />
          </span>
        </span>
      ),
    },
    { id: 'name_ru', header: label('name_ru'), cell: (p) => <TextCell value={p.nameRu} /> },
    { id: 'name_uz', header: label('name_uz'), cell: (p) => <TextCell value={p.nameUz} /> },
    {
      id: 'ticker',
      header: label('ticker'),
      skeleton: 'w-10',
      cell: (p) => <CodeCell value={p.ticker} />,
    },
    {
      id: 'project_types_id',
      header: label('project_types_id'),
      cell: (p) => <TextCell value={p.typeName} />,
    },
    {
      id: 'currency',
      header: label('currency'),
      skeleton: 'w-12',
      cell: (p) => <OptionsCell values={p.currencies} label={opt('currency')} />,
    },
    {
      id: 'minimal_amount',
      header: label('minimal_amount'),
      align: 'right',
      cell: (p) => (p.minimalAmount != null ? formatMoney(p.minimalAmount, p.currency) : <Dash />),
    },
    {
      id: 'deposit_maturity_month',
      header: label('deposit_maturity_month'),
      align: 'right',
      skeleton: 'w-8',
      cell: (p) => <NumberCell value={p.maturityMonths} />,
    },
    {
      id: 'dividend_period',
      header: label('dividend_period'),
      align: 'right',
      skeleton: 'w-8',
      cell: (p) => <NumberCell value={p.dividendAccrualPeriod} />,
    },
    {
      id: 'status',
      header: label('status'),
      skeleton: 'w-20',
      cell: (p) => <OptionsCell values={p.statuses} label={opt('status')} />,
    },
    {
      id: 'sale',
      header: label('sale'),
      skeleton: 'w-8',
      cell: (p) => <YesNoCell value={p.holdWhileSelling} />,
    },
    {
      id: 'investment',
      header: label('investment'),
      skeleton: 'w-8',
      cell: (p) => <YesNoCell value={p.holdOnInvestment} />,
    },
    {
      id: 'insurance',
      header: label('insurance'),
      skeleton: 'w-8',
      cell: (p) => <YesNoCell value={p.insurance} />,
    },
    {
      id: 'insurance_amount',
      header: label('insurance_amount'),
      align: 'right',
      cell: (p) => (p.insuranceAmount != null ? formatMoney(p.insuranceAmount, 'USD') : <Dash />),
    },
    {
      id: 'end_time',
      header: label('end_time'),
      align: 'right',
      cell: (p) => <DateCell value={p.endTime} />,
    },
    {
      id: 'board_order',
      header: label('board_order'),
      align: 'right',
      skeleton: 'w-8',
      cell: (p) => <NumberCell value={p.boardOrder} />,
    },
    {
      id: 'created_time',
      header: label('created_time'),
      align: 'right',
      skeleton: 'w-32',
      cell: (p) => <DateTimeCell value={p.createdTime} />,
    },
    {
      id: 'updated_at',
      header: 'Last updated',
      align: 'right',
      skeleton: 'w-32',
      cell: (p) => <DateTimeCell value={p.updatedAt} />,
    },
  ]
}

export default function ProjectsPage() {
  const list = useListParams(['status'])
  const query = useProjectsQuery({
    page: list.page,
    pageSize: list.pageSize,
    search: list.search,
    filters: multiFilter('status', list.filterList('status')),
  })
  const fields = useTableFields(PROJECTS_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<Project | null>(null)

  const columns = [
    ...buildColumns(fields.fieldLabel, fields.optionLabel),
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

      <FilterBar active={!!list.search || list.hasFilters} onReset={list.resetAll}>
        <SearchInput
          value={list.searchInput}
          onChange={list.setSearchInput}
          placeholder="Search projects"
        />
        <FilterMultiSelect
          label={fields.fieldLabel('status')}
          value={list.filterList('status')}
          onChange={(v) => list.setFilters({ status: v })}
          options={fields.fieldOptions('status')}
        />
      </FilterBar>

      <DataTable
        columns={columns}
        rows={query.data?.items}
        getRowId={(p) => p.id}
        onRowClick={(p) => navigate(RECORDS.projects.detail(p.id))}
        loadingLabel="Loading projects"
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
      <DeleteRecordDialog noun="project" target={toDelete} onClose={() => setToDelete(null)} />
    </>
  )
}
