import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { ACCOUNTS_TABLE, useAccountsQuery, type Account } from '@/entities/account'
import { InvestorFilter } from '@/features/investor-filter'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { dateRangeFilter, equalsFilter } from '@/shared/api/filters'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { useListParams } from '@/shared/hooks/useListParams'
import { formatMoney, formatPhone, investorLabel } from '@/shared/lib/format'
import {
  ButtonLink,
  CodeCell,
  Dash,
  DataTable,
  DateRangeFilter,
  DateTimeCell,
  FilterBar,
  ListEmptyState,
  PageHeader,
  Pagination,
  TextCell,
  type Column,
} from '@/shared/ui'

const FILTER_KEYS = ['investor', 'from', 'to'] as const

// Currencies come from the backend's own labels: "Deposit (UZS)", "Investment (USD)"…
const money = (value: number | null, currency: 'UZS' | 'USD') =>
  value != null ? formatMoney(value, currency) : <Dash />

function buildColumns(label: (f: string) => string): Column<Account>[] {
  return [
    {
      id: 'investor',
      header: label('investors_id'),
      skeleton: 'w-44',
      cell: (a) => (
        <span className="font-medium">
          <TextCell value={a.investorName} />
        </span>
      ),
    },
    {
      id: 'phone',
      header: 'Phone',
      skeleton: 'w-32',
      cell: (a) => <CodeCell value={a.investorPhone && formatPhone(a.investorPhone)} />,
    },
    { id: 'full_name', header: label('full_name'), cell: (a) => <TextCell value={a.fullName} /> },
    {
      id: 'deposit',
      header: label('deposit'),
      align: 'right',
      cell: (a) => money(a.deposit, 'UZS'),
    },
    { id: 'invest', header: label('invest'), align: 'right', cell: (a) => money(a.invest, 'USD') },
    {
      id: 'dividend',
      header: label('dividend'),
      align: 'right',
      cell: (a) => money(a.interestIncome, 'USD'),
    },
    {
      id: 'tranzit',
      header: label('tranzit'),
      align: 'right',
      cell: (a) => money(a.tranzit, 'UZS'),
    },
    {
      id: 'created_at',
      header: 'Created',
      align: 'right',
      skeleton: 'w-32',
      cell: (a) => <DateTimeCell value={a.createdAt} />,
    },
    {
      id: 'updated_at',
      header: 'Last updated',
      align: 'right',
      skeleton: 'w-32',
      cell: (a) => <DateTimeCell value={a.updatedAt} />,
    },
  ]
}

export default function AccountsPage() {
  const list = useListParams(FILTER_KEYS)
  const fields = useTableFields(ACCOUNTS_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<Account | null>(null)

  // No search box: search on this table returns nothing for any term (docs/API.md). Filters work.
  const query = useAccountsQuery({
    page: list.page,
    pageSize: list.pageSize,
    filters: {
      ...equalsFilter('investors_id', list.filter('investor')),
      ...dateRangeFilter('created_at', list.filter('from'), list.filter('to')),
    },
    // No `order`: sorting by `created_at` is a 500 (not a schema field). The default is already newest first.
  })

  return (
    <>
      <PageHeader
        title="Accounts"
        description="Each investor's balances: deposit, investment, interest income and transit."
        actions={
          <ButtonLink to={RECORDS.accounts.create} icon={Plus}>
            Create account
          </ButtonLink>
        }
      />

      <FilterBar active={list.hasFilters} onReset={list.resetAll}>
        <InvestorFilter
          value={list.filter('investor')}
          onChange={(v) => list.setFilters({ investor: v })}
        />
        <DateRangeFilter
          label="Created"
          from={list.filter('from')}
          to={list.filter('to')}
          onChange={({ from, to }) => list.setFilters({ from, to })}
        />
      </FilterBar>

      <DataTable
        columns={[
          ...buildColumns(fields.fieldLabel),
          actionsColumn<Account>({
            onView: (a) => navigate(RECORDS.accounts.detail(a.id)),
            onEdit: (a) => navigate(RECORDS.accounts.edit(a.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(a) => a.id}
        onRowClick={(a) => navigate(RECORDS.accounts.detail(a.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading accounts"
        emptyState={
          <ListEmptyState
            noun="accounts"
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
        noun="account"
        target={
          toDelete && {
            name: `The account of ${investorLabel(toDelete.investorName, toDelete.investorPhone)}`,
          }
        }
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
