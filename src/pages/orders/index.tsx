import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowDownLeft, ArrowUpRight, ClipboardList, Clock, Plus } from 'lucide-react'
import { ORDERS_TABLE, useOrdersQuery, type Order } from '@/entities/order'
import { useProjectOptions } from '@/entities/project'
import { InvestorFilter } from '@/features/investor-filter'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { dateRangeFilter, equalsFilter, multiFilter } from '@/shared/api/filters'
import { useTableCount } from '@/shared/api/useTableCount'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { Can } from '@/shared/permissions'
import { useListParams } from '@/shared/hooks/useListParams'
import { formatPhone } from '@/shared/lib/format'
import { toneFor } from '@/shared/lib/tones'
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
  KpiCard,
  KpiGrid,
  ListEmptyState,
  MoneyCell,
  NumberCell,
  OptionsCell,
  PageHeader,
  Pagination,
  SearchInput,
  TextCell,
  YesNoCell,
  type Column,
} from '@/shared/ui'

const FILTER_KEYS = ['investor', 'project', 'type', 'status', 'currency', 'from', 'to'] as const

// Every field except `otp` (a one-time password, never shown).
function buildColumns(
  label: (f: string) => string,
  opt: (f: string) => (v: string) => string,
): Column<Order>[] {
  return [
    {
      id: 'investor',
      header: label('investors_id'),
      skeleton: 'w-44',
      cell: (o) => (
        <span className="font-medium">
          <TextCell value={o.investorName} />
        </span>
      ),
    },
    {
      id: 'phone',
      header: 'Phone',
      skeleton: 'w-32',
      cell: (o) => <CodeCell value={o.investorPhone && formatPhone(o.investorPhone)} />,
    },
    {
      id: 'external_order_id',
      header: label('external_order_id'),
      cell: (o) => <CodeCell value={o.orderId} />,
    },
    {
      id: 'project',
      header: label('projects_id'),
      cell: (o) => <TextCell value={o.projectName} />,
    },
    {
      id: 'type',
      header: label('type'),
      skeleton: 'w-12',
      cell: (o) => <OptionsCell values={o.type} label={opt('type')} field="type" />,
    },
    {
      id: 'status',
      header: label('status'),
      skeleton: 'w-20',
      cell: (o) => <OptionsCell values={o.status} label={opt('status')} field="status" />,
    },
    {
      id: 'currency',
      header: label('currency'),
      skeleton: 'w-12',
      cell: (o) => <OptionsCell values={o.currency} label={opt('currency')} />,
    },
    {
      id: 'from_account',
      header: label('from_account'),
      cell: (o) => <OptionsCell values={o.fromAccount} label={opt('from_account')} />,
    },
    {
      id: 'to_account',
      header: label('to_account'),
      cell: (o) => <OptionsCell values={o.toAccount} label={opt('to_account')} />,
    },
    {
      id: 'amount_uzs',
      header: label('amount_uzs'),
      align: 'right',
      cell: (o) => <MoneyCell value={o.amountUzs} currency="UZS" />,
    },
    {
      id: 'amount_usd',
      header: label('amount_usd'),
      align: 'right',
      cell: (o) => <MoneyCell value={o.amountUsd} currency="USD" />,
    },
    {
      id: 'amount_uzs_with_fee',
      header: label('amount_uzs_with_fee'),
      align: 'right',
      cell: (o) => <MoneyCell value={o.amountUzsWithFee} currency="UZS" />,
    },
    {
      id: 'amount_usd_with_fee',
      header: label('amount_usd_with_fee'),
      align: 'right',
      cell: (o) => <MoneyCell value={o.amountUsdWithFee} currency="USD" />,
    },
    {
      id: 'transaction_fee',
      header: label('transaction_fee'),
      align: 'right',
      cell: (o) => <AmountCell value={o.transactionFee} />,
    },
    {
      id: 'insurance',
      header: label('insurance'),
      align: 'right',
      cell: (o) => <AmountCell value={o.insurance} />,
    },
    {
      id: 'is_insurance',
      header: label('is_insurance'),
      skeleton: 'w-8',
      cell: (o) => <YesNoCell value={o.isInsurance} />,
    },
    {
      id: 'currency_rate',
      header: label('currency_rate'),
      align: 'right',
      cell: (o) => <NumberCell value={o.currencyRate} />,
    },
    {
      id: 'transaction_id',
      header: label('transaction_id'),
      skeleton: 'w-32',
      cell: (o) => <CodeCell value={o.transactionId} />,
    },
    {
      id: 'deposit_maturity_date',
      header: label('deposit_maturity_date'),
      align: 'right',
      skeleton: 'w-32',
      cell: (o) => <DateTimeCell value={o.depositMaturityDate} />,
    },
    {
      id: 'created_time',
      header: label('created_time'),
      align: 'right',
      skeleton: 'w-32',
      cell: (o) => <DateTimeCell value={o.createdTime} />,
    },
    {
      id: 'updated_time',
      header: label('updated_time'),
      align: 'right',
      skeleton: 'w-32',
      cell: (o) => <DateTimeCell value={o.updatedTime} />,
    },
  ]
}

export default function OrdersPage() {
  const list = useListParams(FILTER_KEYS)
  const fields = useTableFields(ORDERS_TABLE)
  const projects = useProjectOptions()
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<Order | null>(null)
  const opt = (f: string) => (v: string) => fields.optionLabel(f, v)

  const query = useOrdersQuery({
    page: list.page,
    pageSize: list.pageSize,
    search: list.search,
    filters: {
      ...equalsFilter('investors_id', list.filter('investor')),
      ...equalsFilter('projects_id', list.filter('project')),
      ...multiFilter('type', list.filterList('type')),
      ...multiFilter('status', list.filterList('status')),
      ...multiFilter('currency', list.filterList('currency')),
      ...dateRangeFilter('created_time', list.filter('from'), list.filter('to')),
    },
    order: { created_time: -1 },
  })

  // Backend counts; labels come from the backend's options.
  const total = useTableCount(ORDERS_TABLE)
  const buys = useTableCount(ORDERS_TABLE, { type: ['buy'] })
  const sells = useTableCount(ORDERS_TABLE, { type: ['sell'] })
  const pending = useTableCount(ORDERS_TABLE, { status: ['pending'] })

  return (
    <>
      <PageHeader
        title="Orders"
        description="Investors' buy and sell orders on projects."
        actions={
          <Can table={ORDERS_TABLE} action="create">
            <ButtonLink to={RECORDS.orders.create} icon={Plus}>
              Create order
            </ButtonLink>
          </Can>
        }
      />

      <KpiGrid>
        <KpiCard label="Total orders" icon={ClipboardList} tone="accent" value={total.data} />
        <KpiCard
          label={fields.optionLabel('type', 'buy')}
          icon={ArrowDownLeft}
          tone={toneFor('type', 'buy')}
          value={buys.data}
        />
        <KpiCard
          label={fields.optionLabel('type', 'sell')}
          icon={ArrowUpRight}
          tone={toneFor('type', 'sell')}
          value={sells.data}
        />
        <KpiCard
          label={fields.optionLabel('status', 'pending')}
          icon={Clock}
          tone={toneFor('status', 'pending')}
          value={pending.data}
        />
      </KpiGrid>

      <FilterBar active={!!list.search || list.hasFilters} onReset={list.resetAll}>
        <SearchInput
          value={list.searchInput}
          onChange={list.setSearchInput}
          placeholder="Order ID or transaction ID"
        />
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
        {(['type', 'status', 'currency'] as const).map((f) => (
          <FilterMultiSelect
            key={f}
            label={fields.fieldLabel(f)}
            value={list.filterList(f)}
            onChange={(v) => list.setFilters({ [f]: v })}
            options={fields.fieldOptions(f)}
          />
        ))}
        <DateRangeFilter
          label={fields.fieldLabel('created_time')}
          from={list.filter('from')}
          to={list.filter('to')}
          onChange={({ from, to }) => list.setFilters({ from, to })}
        />
      </FilterBar>

      <DataTable
        columns={[
          ...buildColumns(fields.fieldLabel, opt),
          actionsColumn<Order>({
            table: ORDERS_TABLE,
            onView: (o) => navigate(RECORDS.orders.detail(o.id)),
            onEdit: (o) => navigate(RECORDS.orders.edit(o.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(o) => o.id}
        onRowClick={(o) => navigate(RECORDS.orders.detail(o.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading orders"
        emptyState={
          <ListEmptyState
            noun="orders"
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
        noun="order"
        target={toDelete && { name: toDelete.orderId ? `Order ${toDelete.orderId}` : 'This order' }}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
