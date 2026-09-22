import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import {
  PROJECT_TYPES_TABLE,
  useProjectTypesQuery,
  type ProjectType,
} from '@/entities/project-type'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { Can } from '@/shared/permissions'
import { useTableFields } from '@/shared/api/useTableFields'
import { useListParams } from '@/shared/hooks/useListParams'
import { formatNumber } from '@/shared/lib/format'
import {
  ButtonLink,
  Dash,
  DateTimeCell,
  OptionsCell,
  TextCell,
  DataTable,
  FilterBar,
  ListEmptyState,
  PageHeader,
  Pagination,
  SearchInput,
  type Column,
} from '@/shared/ui'

// Every field of the `project_types` table; headers are the backend's labels.
function buildColumns(
  label: (f: string) => string,
  optionLabel: (field: string, value: string) => string,
): Column<ProjectType>[] {
  const percent = (value: number | null) => (value != null ? `${formatNumber(value)}%` : <Dash />)
  return [
    {
      id: 'name_en',
      header: label('name_en'),
      skeleton: 'w-32',
      cell: (t) => (
        <span className="font-medium">
          <TextCell value={t.name} />
        </span>
      ),
    },
    { id: 'name_ru', header: label('name_ru'), cell: (t) => <TextCell value={t.nameRu} /> },
    { id: 'name_uz', header: label('name_uz'), cell: (t) => <TextCell value={t.nameUz} /> },
    {
      id: 'from_percent',
      header: label('from_percent'),
      align: 'right',
      skeleton: 'w-10',
      cell: (t) => percent(t.fromPercent),
    },
    {
      id: 'to_percent',
      header: label('to_percent'),
      align: 'right',
      skeleton: 'w-10',
      cell: (t) => percent(t.toPercent),
    },
    {
      id: 'calculate_dividend',
      header: label('calculate_dividend'),
      skeleton: 'w-20',
      cell: (t) => (
        <OptionsCell
          values={t.dividendCalculation}
          label={(v) => optionLabel('calculate_dividend', v)}
        />
      ),
    },
    {
      id: 'created_at',
      header: 'Created',
      align: 'right',
      skeleton: 'w-32',
      cell: (t) => <DateTimeCell value={t.createdAt} />,
    },
    {
      id: 'updated_at',
      header: 'Last updated',
      align: 'right',
      skeleton: 'w-32',
      cell: (t) => <DateTimeCell value={t.updatedAt} />,
    },
  ]
}

export default function ProjectTypesPage() {
  const list = useListParams()
  const query = useProjectTypesQuery({
    page: list.page,
    pageSize: list.pageSize,
    search: list.search,
  })
  const fields = useTableFields(PROJECT_TYPES_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<ProjectType | null>(null)

  const columns = [
    ...buildColumns(fields.fieldLabel, fields.optionLabel),
    actionsColumn<ProjectType>({
      table: PROJECT_TYPES_TABLE,
      onView: (t) => navigate(RECORDS.projectTypes.detail(t.id)),
      onEdit: (t) => navigate(RECORDS.projectTypes.edit(t.id)),
      onDelete: setToDelete,
    }),
  ]

  return (
    <>
      <PageHeader
        title="Project types"
        description="Yield ranges and dividend rules that projects are built on."
        actions={
          <Can table={PROJECT_TYPES_TABLE} action="create">
            <ButtonLink to={RECORDS.projectTypes.create} icon={Plus}>
              Create project type
            </ButtonLink>
          </Can>
        }
      />

      <FilterBar active={!!list.search} onReset={list.resetAll}>
        <SearchInput
          value={list.searchInput}
          onChange={list.setSearchInput}
          placeholder="Search project types"
        />
      </FilterBar>

      <DataTable
        columns={columns}
        rows={query.data?.items}
        getRowId={(t) => t.id}
        onRowClick={(t) => navigate(RECORDS.projectTypes.detail(t.id))}
        loadingLabel="Loading project types"
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        skeletonRows={3}
        emptyState={
          <ListEmptyState
            noun="project types"
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
      <DeleteRecordDialog noun="project type" target={toDelete} onClose={() => setToDelete(null)} />
    </>
  )
}
