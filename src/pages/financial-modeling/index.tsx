import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import {
  FINANCIAL_MODELING_TABLE,
  useFinancialModelsQuery,
  type FinancialModel,
} from '@/entities/financial-model'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { dateRangeFilter } from '@/shared/api/filters'
import { formatDate } from '@/shared/lib/format'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { Can } from '@/shared/permissions'
import { useListParams } from '@/shared/hooks/useListParams'
import {
  AmountCell,
  ButtonLink,
  CodeCell,
  type Column,
  DataTable,
  DateCell,
  DateRangeFilter,
  DateTimeCell,
  FilterBar,
  ListEmptyState,
  PageHeader,
  Pagination,
} from '@/shared/ui'

function buildColumns(label: (f: string) => string): Column<FinancialModel>[] {
  return [
    {
      id: 'date',
      header: label('date'),
      skeleton: 'w-24',
      cell: (r) => (
        <span className="font-medium">
          <DateCell value={r.date} />
        </span>
      ),
    },
    {
      id: 'project_key_name',
      header: label('project_key_name'),
      skeleton: 'w-16',
      cell: (r) => <CodeCell value={r.projectKeyName} />,
    },
    // "Price": no currency in the backend, so none is shown (DESIGN.md §0).
    {
      id: 'price',
      header: label('price'),
      align: 'right',
      cell: (r) => <AmountCell value={r.price} />,
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

export default function Page() {
  const list = useListParams(['from', 'to'])
  const fields = useTableFields(FINANCIAL_MODELING_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<FinancialModel | null>(null)
  const query = useFinancialModelsQuery({
    page: list.page,
    pageSize: list.pageSize,
    filters: { ...dateRangeFilter('date', list.filter('from'), list.filter('to')) },
    order: { date: -1 },
  })

  return (
    <>
      <PageHeader
        title="Financial modeling"
        description="Daily reference prices used for modeling returns."
        actions={
          <Can table={FINANCIAL_MODELING_TABLE} action="create">
            <ButtonLink to={RECORDS.financialModeling.create} icon={Plus}>
              Add price
            </ButtonLink>
          </Can>
        }
      />
      <FilterBar active={list.hasFilters} onReset={list.resetAll}>
        <DateRangeFilter
          label={fields.fieldLabel('date')}
          from={list.filter('from')}
          to={list.filter('to')}
          onChange={({ from, to }) => list.setFilters({ from, to })}
        />
      </FilterBar>
      <DataTable
        columns={[
          ...buildColumns(fields.fieldLabel),
          actionsColumn<FinancialModel>({
            table: FINANCIAL_MODELING_TABLE,
            onView: (r) => navigate(RECORDS.financialModeling.detail(r.id)),
            onEdit: (r) => navigate(RECORDS.financialModeling.edit(r.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(RECORDS.financialModeling.detail(r.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading prices"
        emptyState={
          <ListEmptyState
            noun="prices"
            isError={query.isError}
            retrying={query.isFetching}
            onRetry={() => query.refetch()}
            search={''}
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
        noun="price"
        target={
          toDelete && {
            name: toDelete.date
              ? `${toDelete.projectKeyName ?? 'Price'} for ${formatDate(toDelete.date)}`
              : 'This price',
          }
        }
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
