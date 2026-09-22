import {
  PROJECT_TYPES_TABLE,
  useProjectTypesQuery,
  type ProjectType,
} from '@/entities/project-type'
import { useTableFields } from '@/shared/api/useTableFields'
import { useListParams } from '@/shared/hooks/useListParams'
import { formatDate, formatNumber } from '@/shared/lib/format'
import {
  Badge,
  DataTable,
  FilterBar,
  ListEmptyState,
  PageHeader,
  Pagination,
  SearchInput,
  type Column,
} from '@/shared/ui'

const dash = <span className="text-fg-subtle">—</span>
const percent = (value: number | null) => (value != null ? `${formatNumber(value)}%` : dash)

function buildColumns(
  optionLabel: (field: string, value: string) => string,
): Column<ProjectType>[] {
  return [
    {
      id: 'name',
      header: 'Name',
      skeleton: 'w-32',
      cell: (t) => (
        <div>
          <div className="font-medium">{t.name}</div>
          <div className="text-xs text-fg-muted">{t.nameRu}</div>
        </div>
      ),
    },
    {
      id: 'from',
      header: 'From %',
      align: 'right',
      skeleton: 'w-10',
      cell: (t) => percent(t.fromPercent),
    },
    {
      id: 'to',
      header: 'To %',
      align: 'right',
      skeleton: 'w-10',
      cell: (t) => percent(t.toPercent),
    },
    {
      id: 'calculate-dividend',
      header: 'Calculate dividend',
      skeleton: 'w-20',
      cell: (t) =>
        t.dividendCalculation.length ? (
          <div className="flex gap-1.5">
            {t.dividendCalculation.map((v) => (
              <Badge key={v}>{optionLabel('calculate_dividend', v)}</Badge>
            ))}
          </div>
        ) : (
          dash
        ),
    },
    { id: 'updated', header: 'Last updated', align: 'right', cell: (t) => formatDate(t.updatedAt) },
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

  return (
    <>
      <PageHeader
        title="Project types"
        description="Yield ranges and dividend rules that projects are built on."
      />

      <FilterBar>
        <SearchInput
          value={list.searchInput}
          onChange={list.setSearchInput}
          placeholder="Search project types"
        />
      </FilterBar>

      <DataTable
        columns={buildColumns(fields.optionLabel)}
        rows={query.data?.items}
        getRowId={(t) => t.id}
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
    </>
  )
}
