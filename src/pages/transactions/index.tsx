import { useNavigate } from 'react-router'
import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  HandCoins,
  ShoppingCart,
  type LucideIcon,
} from 'lucide-react'
import { TRANSACTIONS_TABLE, useTransactionsQuery, type Transaction } from '@/entities/transaction'
import { useProjectOptions } from '@/entities/project'
import { InvestorFilter } from '@/features/investor-filter'
import { dateRangeFilter, equalsFilter, multiFilter } from '@/shared/api/filters'
import { useTableCount } from '@/shared/api/useTableCount'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { useListParams } from '@/shared/hooks/useListParams'
import { formatPhone } from '@/shared/lib/format'
import { toneFor } from '@/shared/lib/tones'
import {
  AmountCell,
  CodeCell,
  DataTable,
  DirectionCell,
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

const FILTER_KEYS = [
  'investor',
  'project',
  'operation',
  'status',
  'payment_type',
  'currency',
  'from',
  'to',
] as const

// Read-only ledger: no create/edit/delete. Every field except:
// - `otp` (a one-time password, never shown)
// - `investors_id_2` "Investors": identical to `investors_id` on all 3 158 rows (checked 2026-09-22)
// - `snapshot_*` (empty on all rows) and `score` (filled on 2 rows): detail page only, see docs/API.md
function buildColumns(
  label: (f: string) => string,
  opt: (f: string) => (v: string) => string,
): Column<Transaction>[] {
  return [
    {
      id: 'investor',
      header: label('investors_id'),
      skeleton: 'w-44',
      cell: (t) => (
        <span className="font-medium">
          <TextCell value={t.investorName} />
        </span>
      ),
    },
    {
      id: 'phone',
      header: 'Phone',
      skeleton: 'w-32',
      cell: (t) => <CodeCell value={t.investorPhone && formatPhone(t.investorPhone)} />,
    },
    {
      id: 'external_id',
      header: label('external_id'),
      skeleton: 'w-40',
      cell: (t) => <CodeCell value={t.transactionId} />,
    },
    {
      id: 'operation',
      header: label('operation'),
      skeleton: 'w-16',
      cell: (t) => <OptionsCell values={t.operation} label={opt('operation')} field="operation" />,
    },
    {
      id: 'status',
      header: label('status'),
      skeleton: 'w-20',
      cell: (t) => <OptionsCell values={t.status} label={opt('status')} field="status" />,
    },
    {
      id: 'type',
      header: label('type'),
      skeleton: 'w-7',
      cell: (t) => <DirectionCell value={t.direction} />,
    },
    {
      id: 'payment_type',
      header: label('payment_type'),
      cell: (t) => <OptionsCell values={t.paymentType} label={opt('payment_type')} />,
    },
    {
      id: 'currency',
      header: label('currency'),
      skeleton: 'w-12',
      cell: (t) => <OptionsCell values={t.currency} label={opt('currency')} />,
    },
    {
      id: 'account',
      header: label('account'),
      cell: (t) => <OptionsCell values={t.account} label={opt('account')} />,
    },
    {
      id: 'from_account',
      header: label('from_account'),
      cell: (t) => <OptionsCell values={t.fromAccount} label={opt('from_account')} />,
    },
    {
      id: 'to_account',
      header: label('to_account'),
      cell: (t) => <OptionsCell values={t.toAccount} label={opt('to_account')} />,
    },
    {
      id: 'amount_uzs',
      header: label('amount_uzs'),
      align: 'right',
      cell: (t) => <MoneyCell value={t.amountUzs} currency="UZS" />,
    },
    {
      id: 'amount_usd',
      header: label('amount_usd'),
      align: 'right',
      cell: (t) => <MoneyCell value={t.amountUsd} currency="USD" />,
    },
    {
      id: 'amount_uzs_with_fee',
      header: label('amount_uzs_with_fee'),
      align: 'right',
      cell: (t) => <MoneyCell value={t.amountUzsWithFee} currency="UZS" />,
    },
    {
      id: 'amount_usd_with_fee',
      header: label('amount_usd_with_fee'),
      align: 'right',
      cell: (t) => <MoneyCell value={t.amountUsdWithFee} currency="USD" />,
    },
    {
      id: 'transaction_fee',
      header: label('transaction_fee'),
      align: 'right',
      cell: (t) => <AmountCell value={t.transactionFee} />,
    },
    {
      id: 'insurance',
      header: label('insurance'),
      align: 'right',
      cell: (t) => <AmountCell value={t.insurance} />,
    },
    {
      id: 'is_insurance',
      header: label('is_insurance'),
      skeleton: 'w-8',
      cell: (t) => <YesNoCell value={t.isInsurance} />,
    },
    {
      id: 'currency_rate',
      header: label('currency_rate'),
      align: 'right',
      cell: (t) => <NumberCell value={t.currencyRate} />,
    },
    {
      id: 'project',
      header: label('projects_id'),
      cell: (t) => <TextCell value={t.projectName} />,
    },
    { id: 'order', header: label('orders_id'), cell: (t) => <CodeCell value={t.orderNumber} /> },
    {
      id: 'card',
      header: label('investor_cards_id'),
      skeleton: 'w-36',
      cell: (t) => <CodeCell value={t.cardPan} />,
    },
    {
      id: 'created_time',
      header: label('created_time'),
      align: 'right',
      skeleton: 'w-32',
      cell: (t) => <DateTimeCell value={t.createdTime} />,
    },
    {
      id: 'updated_time',
      header: label('updated_time'),
      align: 'right',
      skeleton: 'w-32',
      cell: (t) => <DateTimeCell value={t.updatedTime} />,
    },
  ]
}

const OPERATIONS: { value: string; icon: LucideIcon }[] = [
  { value: 'topup', icon: ArrowDownToLine },
  { value: 'withdraw', icon: ArrowUpFromLine },
  { value: 'buy', icon: ShoppingCart },
  { value: 'dividend', icon: HandCoins },
  { value: 'transfer', icon: ArrowLeftRight },
]

function OperationKpi({ value, icon, label }: { value: string; icon: LucideIcon; label: string }) {
  const count = useTableCount(TRANSACTIONS_TABLE, { operation: [value] })
  return <KpiCard label={label} icon={icon} tone={toneFor('operation', value)} value={count.data} />
}

export default function TransactionsPage() {
  const list = useListParams(FILTER_KEYS)
  const fields = useTableFields(TRANSACTIONS_TABLE)
  const projects = useProjectOptions()
  const navigate = useNavigate()
  const opt = (f: string) => (v: string) => fields.optionLabel(f, v)

  const query = useTransactionsQuery({
    page: list.page,
    pageSize: list.pageSize,
    search: list.search,
    filters: {
      ...equalsFilter('investors_id', list.filter('investor')),
      ...equalsFilter('projects_id', list.filter('project')),
      ...multiFilter('operation', list.filterList('operation')),
      ...multiFilter('status', list.filterList('status')),
      ...multiFilter('payment_type', list.filterList('payment_type')),
      ...multiFilter('currency', list.filterList('currency')),
      ...dateRangeFilter('created_time', list.filter('from'), list.filter('to')),
    },
    order: { created_time: -1 },
  })

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Every money movement: top-ups, withdrawals, purchases, dividends and transfers."
      />

      {/* The operation values are the backend's own options; each count is computed by the backend. */}
      <KpiGrid>
        {OPERATIONS.map((o) => (
          <OperationKpi
            key={o.value}
            value={o.value}
            icon={o.icon}
            label={fields.optionLabel('operation', o.value)}
          />
        ))}
      </KpiGrid>

      <FilterBar active={!!list.search || list.hasFilters} onReset={list.resetAll}>
        <SearchInput
          value={list.searchInput}
          onChange={list.setSearchInput}
          placeholder="Transaction ID"
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
        {(['operation', 'status', 'payment_type', 'currency'] as const).map((f) => (
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
        columns={buildColumns(fields.fieldLabel, opt)}
        rows={query.data?.items}
        getRowId={(t) => t.id}
        onRowClick={(t) => navigate(RECORDS.transactions.detail(t.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading transactions"
        emptyState={
          <ListEmptyState
            noun="transactions"
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
    </>
  )
}
