import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { DIVIDENDS_TABLE, useDividendsQuery, type Dividend } from '@/entities/dividend'
import { useProjectOptions } from '@/entities/project'
import { InvestorFilter } from '@/features/investor-filter'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { dateRangeFilter, equalsFilter, multiFilter } from '@/shared/api/filters'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { useListParams } from '@/shared/hooks/useListParams'
import { formatPhone } from '@/shared/lib/format'
import {
  AmountCell,
  ButtonLink,
  CodeCell,
  DataTable,
  DateRangeFilter,
  DateTimeCell,
  FilterBar,
  FilterMultiSelect,
  FilterSelect,
  ListEmptyState,
  MoneyCell,
  NumberCell,
  OptionsCell,
  PageHeader,
  Pagination,
  PercentCell,
  TextCell,
  type Column,
} from '@/shared/ui'

const FILTER_KEYS = ['investor', 'project', 'type', 'from', 'to'] as const

function buildColumns(
  label: (f: string) => string,
  opt: (f: string) => (v: string) => string,
): Column<Dividend>[] {
  return [
    {
      id: 'investor',
      header: label('investors_id'),
      skeleton: 'w-44',
      cell: (d) => (
        <span className="font-medium">
          <TextCell value={d.investorName} />
        </span>
      ),
    },
    {
      id: 'phone',
      header: 'Phone',
      skeleton: 'w-32',
      cell: (d) => <CodeCell value={d.investorPhone && formatPhone(d.investorPhone)} />,
    },
    {
      id: 'project',
      header: label('projects_id'),
      cell: (d) => <TextCell value={d.projectName} />,
    },
    {
      id: 'type',
      header: label('type'),
      skeleton: 'w-14',
      cell: (d) => <OptionsCell values={d.type} label={opt('type')} />,
    },
    {
      id: 'percent',
      header: label('percent'),
      align: 'right',
      skeleton: 'w-10',
      cell: (d) => <PercentCell value={d.percent} />,
    },
    {
      id: 'days',
      header: label('days'),
      align: 'right',
      skeleton: 'w-8',
      cell: (d) => <NumberCell value={d.days} />,
    },
    {
      id: 'period_days',
      header: label('period_days'),
      align: 'right',
      skeleton: 'w-8',
      cell: (d) => <NumberCell value={d.periodDays} />,
    },
    {
      id: 'order_amount',
      header: label('order_amount'),
      align: 'right',
      cell: (d) => <AmountCell value={d.orderAmount} />,
    },
    {
      id: 'amount_uzs',
      header: label('amount_uzs'),
      align: 'right',
      cell: (d) => <MoneyCell value={d.amountUzs} currency="UZS" />,
    },
    {
      id: 'amount_usd',
      header: label('amount_usd'),
      align: 'right',
      cell: (d) => <MoneyCell value={d.amountUsd} currency="USD" />,
    },
    {
      id: 'from_date',
      header: label('from_date'),
      align: 'right',
      skeleton: 'w-32',
      cell: (d) => <DateTimeCell value={d.fromDate} />,
    },
    {
      id: 'to_date',
      header: label('to_date'),
      align: 'right',
      skeleton: 'w-32',
      cell: (d) => <DateTimeCell value={d.toDate} />,
    },
    {
      id: 'created_at',
      header: 'Created',
      align: 'right',
      skeleton: 'w-32',
      cell: (d) => <DateTimeCell value={d.createdAt} />,
    },
    {
      id: 'updated_at',
      header: 'Last updated',
      align: 'right',
      skeleton: 'w-32',
      cell: (d) => <DateTimeCell value={d.updatedAt} />,
    },
  ]
}

export default function DividendsPage() {
  const list = useListParams(FILTER_KEYS)
  const fields = useTableFields(DIVIDENDS_TABLE)
  const projects = useProjectOptions()
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<Dividend | null>(null)
  const opt = (f: string) => (v: string) => fields.optionLabel(f, v)

  // No search box: the backend ignores `search` on this table (docs/API.md). Filters work.
  const query = useDividendsQuery({
    page: list.page,
    pageSize: list.pageSize,
    filters: {
      ...equalsFilter('investors_id', list.filter('investor')),
      ...equalsFilter('projects_id', list.filter('project')),
      ...multiFilter('type', list.filterList('type')),
      ...dateRangeFilter('from_date', list.filter('from'), list.filter('to')),
    },
    order: { from_date: -1 },
  })

  return (
    <>
      <PageHeader
        title="Dividends"
        description="Interest accrued to investors per project and period."
        actions={
          <ButtonLink to={RECORDS.dividends.create} icon={Plus}>
            Create dividend
          </ButtonLink>
        }
      />
      <FilterBar active={list.hasFilters} onReset={list.resetAll}>
        <InvestorFilter
          value={list.filter('investor')}
          onChange={(v) => list.setFilters({ investor: v })}
        />
        <FilterSelect
          label={fields.fieldLabel('projects_id')}
          value={list.filter('project')}
          onChange={(v) => list.setFilters({ project: v })}
          options={projects.options}
        />
        <FilterMultiSelect
          label={fields.fieldLabel('type')}
          value={list.filterList('type')}
          onChange={(v) => list.setFilters({ type: v })}
          options={fields.fieldOptions('type')}
        />
        <DateRangeFilter
          label={`Period (${fields.fieldLabel('from_date')})`}
          from={list.filter('from')}
          to={list.filter('to')}
          onChange={({ from, to }) => list.setFilters({ from, to })}
        />
      </FilterBar>
      <DataTable
        columns={[
          ...buildColumns(fields.fieldLabel, opt),
          actionsColumn<Dividend>({
            onView: (d) => navigate(RECORDS.dividends.detail(d.id)),
            onEdit: (d) => navigate(RECORDS.dividends.edit(d.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(d) => d.id}
        onRowClick={(d) => navigate(RECORDS.dividends.detail(d.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading dividends"
        emptyState={
          <ListEmptyState
            noun="dividends"
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
        noun="dividend"
        target={toDelete && { name: `The dividend of ${toDelete.investorName ?? 'this investor'}` }}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
