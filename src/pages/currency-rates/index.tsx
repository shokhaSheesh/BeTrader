import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import {
  CURRENCY_RATES_TABLE,
  useCurrencyRatesQuery,
  type CurrencyRate,
} from '@/entities/currency-rate'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { dateRangeFilter } from '@/shared/api/filters'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { Can } from '@/shared/permissions'
import { useListParams } from '@/shared/hooks/useListParams'
import { formatDate } from '@/shared/lib/format'
import {
  AmountCell,
  ButtonLink,
  DataTable,
  DateCell,
  DateRangeFilter,
  DateTimeCell,
  FilterBar,
  ListEmptyState,
  PageHeader,
  Pagination,
  PercentCell,
  type Column,
} from '@/shared/ui'

const FILTER_KEYS = ['from', 'to'] as const

// "Amount" carries no currency in the backend, so none is shown (DESIGN.md §0).
function buildColumns(label: (f: string) => string): Column<CurrencyRate>[] {
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
      id: 'amount',
      header: label('amount'),
      align: 'right',
      cell: (r) => <AmountCell value={r.amount} />,
    },
    {
      id: 'percent',
      header: label('percent'),
      align: 'right',
      skeleton: 'w-10',
      cell: (r) => <PercentCell value={r.percent} />,
    },
    {
      id: 'amount_with_percent',
      header: label('amount_with_percent'),
      align: 'right',
      cell: (r) => <AmountCell value={r.amountWithPercent} />,
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

export default function CurrencyRatesPage() {
  const list = useListParams(FILTER_KEYS)
  const fields = useTableFields(CURRENCY_RATES_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<CurrencyRate | null>(null)

  // No search box: `search` is ignored on this table. The date filter runs on the backend.
  const query = useCurrencyRatesQuery({
    page: list.page,
    pageSize: list.pageSize,
    filters: dateRangeFilter('date', list.filter('from'), list.filter('to')),
    order: { date: -1 },
  })

  return (
    <>
      <PageHeader
        title="Currency rates"
        description="The daily USD rate used for conversions."
        actions={
          <Can table={CURRENCY_RATES_TABLE} action="create">
            <ButtonLink to={RECORDS.currencyRates.create} icon={Plus}>
              Add currency rate
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
          actionsColumn<CurrencyRate>({
            table: CURRENCY_RATES_TABLE,
            onView: (r) => navigate(RECORDS.currencyRates.detail(r.id)),
            onEdit: (r) => navigate(RECORDS.currencyRates.edit(r.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(RECORDS.currencyRates.detail(r.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading currency rates"
        emptyState={
          <ListEmptyState
            noun="currency rates"
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
        noun="currency rate"
        target={
          toDelete && {
            name: toDelete.date ? `The rate for ${formatDate(toDelete.date)}` : 'This rate',
          }
        }
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
