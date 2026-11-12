import { useNavigate } from 'react-router'
import { ACCOUNTS_TABLE, useAccountsQuery, type Account } from '@/entities/account'
import { DIVIDENDS_TABLE, useDividendsQuery, type Dividend } from '@/entities/dividend'
import { PROJECTS_TABLE, useProjectsQuery, type Project } from '@/entities/project'
import {
  PROJECT_INVESTORS_TABLE,
  useProjectInvestorsQuery,
  type ProjectInvestor,
} from '@/entities/project-investor'
import { TRANSACTIONS_TABLE, useTransactionsQuery, type Transaction } from '@/entities/transaction'
import type { TableFilters } from '@/shared/api/ucode'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import {
  AmountCell,
  CodeCell,
  DateTimeCell,
  DirectionCell,
  MoneyCell,
  NumberCell,
  OptionsCell,
  PercentCell,
  RecordLink,
  TextCell,
  YesNoCell,
  type Column,
} from '@/shared/ui'
import { RelatedTable } from './RelatedTable'

// The tabs of u-code's detail pages: each lists the linked table with the columns u-code's own
// detail view shows (read from its views, docs/API.md → "Detail pages"). Headers are the
// backend's field names, so they follow the interface language.

interface ListProps {
  /** e.g. `{ projects_id: id }` */
  filters: TableFilters
}

const name = (value: string | null | undefined) => (
  <span className="font-medium">
    <TextCell value={value} />
  </span>
)

/** Project investors (holdings): Project → its investors, Investor → their projects. */
export function ProjectInvestorsList({ filters }: ListProps) {
  const navigate = useNavigate()
  const f = useTableFields(PROJECT_INVESTORS_TABLE)
  const L = f.fieldLabel
  const columns: Column<ProjectInvestor>[] = [
    {
      id: 'investor',
      header: L('investors_id'),
      skeleton: 'w-44',
      cell: (r) => (
        <RecordLink to={r.investorId && RECORDS.investors.detail(r.investorId)}>
          {name(r.investorName)}
        </RecordLink>
      ),
    },
    {
      id: 'project',
      header: L('projects_id'),
      cell: (r) => (
        <RecordLink to={r.projectId && RECORDS.projects.detail(r.projectId)}>
          <TextCell value={r.projectName} />
        </RecordLink>
      ),
    },
    {
      id: 'investment',
      header: L('investment'),
      align: 'right',
      cell: (r) => <AmountCell value={r.investment} />,
    },
    {
      id: 'dividend',
      header: L('dividend'),
      align: 'right',
      cell: (r) => <AmountCell value={r.interestIncome} />,
    },
    {
      id: 'created',
      header: L('created_time'),
      align: 'right',
      skeleton: 'w-32',
      cell: (r) => <DateTimeCell value={r.createdTime} />,
    },
    {
      id: 'updated',
      header: L('updated_time'),
      align: 'right',
      skeleton: 'w-32',
      cell: (r) => <DateTimeCell value={r.updatedTime} />,
    },
  ]
  return (
    <RelatedTable
      useList={useProjectInvestorsQuery}
      filters={filters}
      order={{ created_time: -1 }}
      columns={columns}
      getRowId={(r) => r.id}
      onRowClick={(r) => navigate(RECORDS.projectInvestors.detail(r.id))}
      labelsPending={f.isPending}
    />
  )
}

/** A project's dividends. */
export function DividendsList({ filters }: ListProps) {
  const navigate = useNavigate()
  const f = useTableFields(DIVIDENDS_TABLE)
  const L = f.fieldLabel
  const columns: Column<Dividend>[] = [
    {
      id: 'project',
      header: L('projects_id'),
      cell: (r) => (
        <RecordLink to={r.projectId && RECORDS.projects.detail(r.projectId)}>
          <TextCell value={r.projectName} />
        </RecordLink>
      ),
    },
    {
      id: 'from',
      header: L('from_date'),
      skeleton: 'w-32',
      cell: (r) => <DateTimeCell value={r.fromDate} />,
    },
    {
      id: 'to',
      header: L('to_date'),
      skeleton: 'w-32',
      cell: (r) => <DateTimeCell value={r.toDate} />,
    },
    {
      id: 'period_days',
      header: L('period_days'),
      align: 'right',
      cell: (r) => <NumberCell value={r.periodDays} />,
    },
    { id: 'days', header: L('days'), align: 'right', cell: (r) => <NumberCell value={r.days} /> },
    {
      id: 'percent',
      header: L('percent'),
      align: 'right',
      cell: (r) => <PercentCell value={r.percent} />,
    },
    {
      id: 'order_amount',
      header: L('order_amount'),
      align: 'right',
      cell: (r) => <AmountCell value={r.orderAmount} />,
    },
    {
      id: 'amount_usd',
      header: L('amount_usd'),
      align: 'right',
      cell: (r) => <MoneyCell value={r.amountUsd} currency="USD" />,
    },
    {
      id: 'amount_uzs',
      header: L('amount_uzs'),
      align: 'right',
      cell: (r) => <MoneyCell value={r.amountUzs} currency="UZS" />,
    },
    {
      id: 'type',
      header: L('type'),
      cell: (r) => <OptionsCell values={r.type} label={(v) => f.optionLabel('type', v)} />,
    },
    {
      id: 'investor',
      header: L('investors_id'),
      skeleton: 'w-44',
      cell: (r) => (
        <RecordLink to={r.investorId && RECORDS.investors.detail(r.investorId)}>
          {name(r.investorName)}
        </RecordLink>
      ),
    },
  ]
  return (
    <RelatedTable
      useList={useDividendsQuery}
      filters={filters}
      order={{ created_at: -1 }}
      columns={columns}
      getRowId={(r) => r.id}
      onRowClick={(r) => navigate(RECORDS.dividends.detail(r.id))}
      labelsPending={f.isPending}
    />
  )
}

/** A project type's projects. */
export function ProjectsList({ filters }: ListProps) {
  const navigate = useNavigate()
  const f = useTableFields(PROJECTS_TABLE)
  const L = f.fieldLabel
  const columns: Column<Project>[] = [
    { id: 'name_uz', header: L('name_uz'), cell: (r) => <TextCell value={r.nameUz} /> },
    { id: 'name_ru', header: L('name_ru'), cell: (r) => <TextCell value={r.nameRu} /> },
    { id: 'name_en', header: L('name_en'), cell: (r) => name(r.name) },
    {
      id: 'status',
      header: L('status'),
      cell: (r) => (
        <OptionsCell values={r.statuses} label={(v) => f.optionLabel('status', v)} field="status" />
      ),
    },
  ]
  return (
    <RelatedTable
      useList={useProjectsQuery}
      filters={filters}
      columns={columns}
      getRowId={(r) => r.id}
      onRowClick={(r) => navigate(RECORDS.projects.detail(r.id))}
      labelsPending={f.isPending}
    />
  )
}

/** An investor's accounts. */
export function AccountsList({ filters }: ListProps) {
  const navigate = useNavigate()
  const f = useTableFields(ACCOUNTS_TABLE)
  const L = f.fieldLabel
  const columns: Column<Account>[] = [
    {
      id: 'deposit',
      header: L('deposit'),
      align: 'right',
      cell: (r) => <MoneyCell value={r.deposit} currency="UZS" />,
    },
    {
      id: 'dividend',
      header: L('dividend'),
      align: 'right',
      cell: (r) => <MoneyCell value={r.interestIncome} currency="USD" />,
    },
    {
      id: 'tranzit',
      header: L('tranzit'),
      align: 'right',
      cell: (r) => <MoneyCell value={r.tranzit} currency="UZS" />,
    },
    {
      id: 'invest',
      header: L('invest'),
      align: 'right',
      cell: (r) => <MoneyCell value={r.invest} currency="USD" />,
    },
  ]
  return (
    <RelatedTable
      useList={useAccountsQuery}
      filters={filters}
      columns={columns}
      getRowId={(r) => r.id}
      onRowClick={(r) => navigate(RECORDS.accounts.detail(r.id))}
      labelsPending={f.isPending}
    />
  )
}

/** An investor's transactions, in the column order of u-code's detail view. */
export function TransactionsList({ filters }: ListProps) {
  const navigate = useNavigate()
  const f = useTableFields(TRANSACTIONS_TABLE)
  const L = f.fieldLabel
  const opt = (field: string) => (v: string) => f.optionLabel(field, v)
  const columns: Column<Transaction>[] = [
    {
      id: 'amount_usd',
      header: L('amount_usd'),
      align: 'right',
      cell: (r) => <MoneyCell value={r.amountUsd} currency="USD" />,
    },
    {
      id: 'operation',
      header: L('operation'),
      cell: (r) => <OptionsCell values={r.operation} label={opt('operation')} field="operation" />,
    },
    {
      id: 'status',
      header: L('status'),
      cell: (r) => <OptionsCell values={r.status} label={opt('status')} field="status" />,
    },
    {
      id: 'currency_rate',
      header: L('currency_rate'),
      align: 'right',
      cell: (r) => <AmountCell value={r.currencyRate} />,
    },
    {
      id: 'amount_uzs',
      header: L('amount_uzs'),
      align: 'right',
      cell: (r) => <MoneyCell value={r.amountUzs} currency="UZS" />,
    },
    {
      id: 'amount_uzs_with_fee',
      header: L('amount_uzs_with_fee'),
      align: 'right',
      cell: (r) => <MoneyCell value={r.amountUzsWithFee} currency="UZS" />,
    },
    {
      id: 'updated',
      header: L('updated_time'),
      skeleton: 'w-32',
      cell: (r) => <DateTimeCell value={r.updatedTime} />,
    },
    {
      id: 'external_id',
      header: L('external_id'),
      skeleton: 'w-40',
      cell: (r) => <CodeCell value={r.transactionId} />,
    },
    { id: 'type', header: L('type'), cell: (r) => <DirectionCell value={r.direction} /> },
    {
      id: 'account',
      header: L('account'),
      cell: (r) => <OptionsCell values={r.account} label={opt('account')} />,
    },
    {
      id: 'payment_type',
      header: L('payment_type'),
      cell: (r) => <OptionsCell values={r.paymentType} label={opt('payment_type')} />,
    },
    {
      id: 'order',
      header: L('orders_id'),
      cell: (r) => (
        <RecordLink to={r.orderId && RECORDS.orders.detail(r.orderId)}>
          <CodeCell value={r.orderNumber} />
        </RecordLink>
      ),
    },
    {
      id: 'project',
      header: L('projects_id'),
      cell: (r) => (
        <RecordLink to={r.projectId && RECORDS.projects.detail(r.projectId)}>
          <TextCell value={r.projectName} />
        </RecordLink>
      ),
    },
    {
      id: 'currency',
      header: L('currency'),
      cell: (r) => <OptionsCell values={r.currency} label={opt('currency')} />,
    },
    {
      id: 'created',
      header: L('created_time'),
      skeleton: 'w-32',
      cell: (r) => <DateTimeCell value={r.createdTime} />,
    },
    {
      id: 'card',
      header: L('investor_cards_id'),
      cell: (r) => (
        <RecordLink to={r.cardId && RECORDS.cards.detail(r.cardId)}>
          <CodeCell value={r.cardPan} />
        </RecordLink>
      ),
    },
    {
      id: 'insurance',
      header: L('insurance'),
      align: 'right',
      cell: (r) => <AmountCell value={r.insurance} />,
    },
    {
      id: 'transaction_fee',
      header: L('transaction_fee'),
      align: 'right',
      cell: (r) => <AmountCell value={r.transactionFee} />,
    },
    {
      id: 'amount_usd_with_fee',
      header: L('amount_usd_with_fee'),
      align: 'right',
      cell: (r) => <MoneyCell value={r.amountUsdWithFee} currency="USD" />,
    },
    {
      id: 'investor',
      header: L('investors_id'),
      skeleton: 'w-44',
      cell: (r) => (
        <RecordLink to={r.investorId && RECORDS.investors.detail(r.investorId)}>
          {name(r.investorName)}
        </RecordLink>
      ),
    },
    {
      id: 'is_insurance',
      header: L('is_insurance'),
      cell: (r) => <YesNoCell value={r.isInsurance} />,
    },
  ]
  return (
    <RelatedTable
      useList={useTransactionsQuery}
      filters={filters}
      order={{ created_time: -1 }}
      columns={columns}
      getRowId={(r) => r.id}
      onRowClick={(r) => navigate(RECORDS.transactions.detail(r.id))}
      labelsPending={f.isPending}
    />
  )
}
