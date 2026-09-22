import { useState } from 'react'
import { useNavigate } from 'react-router'
import { CalendarClock, CalendarX, CreditCard, Plus } from 'lucide-react'
import { CARDS_TABLE, useInvestorCardsQuery, type InvestorCard } from '@/entities/investor-card'
import { InvestorFilter } from '@/features/investor-filter'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { dateRangeFilter, equalsFilter } from '@/shared/api/filters'
import { useTableCount } from '@/shared/api/useTableCount'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { useListParams } from '@/shared/hooks/useListParams'
import { toIsoDate } from '@/shared/lib/date'
import { formatPhone } from '@/shared/lib/format'
import {
  ButtonLink,
  CodeCell,
  DataTable,
  DateCell,
  DateRangeFilter,
  DateTimeCell,
  FilterBar,
  KpiCard,
  KpiGrid,
  ListEmptyState,
  PageHeader,
  Pagination,
  SearchInput,
  TextCell,
  type Column,
} from '@/shared/ui'

const FILTER_KEYS = ['investor', 'exp_from', 'exp_to'] as const

// `card_token` is never shown: it's a payment token (see entities/investor-card).
// Investor first (who owns it), then the card. `card_token` is never shown (see entities/investor-card).
function buildColumns(label: (f: string) => string): Column<InvestorCard>[] {
  return [
    {
      id: 'investor',
      header: label('investors_id'),
      skeleton: 'w-44',
      cell: (c) => (
        <span className="font-medium">
          <TextCell value={c.investorName} />
        </span>
      ),
    },
    {
      id: 'phone',
      header: 'Phone',
      skeleton: 'w-32',
      cell: (c) => <CodeCell value={c.investorPhone && formatPhone(c.investorPhone)} />,
    },
    {
      id: 'masked_pan',
      header: label('masked_pan'),
      skeleton: 'w-40',
      cell: (c) => <CodeCell value={c.maskedPan} />,
    },
    { id: 'card_name', header: label('card_name'), cell: (c) => <TextCell value={c.cardName} /> },
    {
      id: 'type',
      header: label('type'),
      skeleton: 'w-16',
      cell: (c) => <TextCell value={c.type} />,
    },
    {
      id: 'expiry_date',
      header: label('expiry_date'),
      align: 'right',
      cell: (c) => <DateCell value={c.expiryDate} />,
    },
    {
      id: 'created_time',
      header: label('created_time'),
      align: 'right',
      skeleton: 'w-32',
      cell: (c) => <DateTimeCell value={c.createdTime} />,
    },
    {
      id: 'updated_at',
      header: 'Last updated',
      align: 'right',
      skeleton: 'w-32',
      cell: (c) => <DateTimeCell value={c.updatedAt} />,
    },
  ]
}

const now = new Date()
const TODAY = toIsoDate(now.getFullYear(), now.getMonth(), now.getDate())
const IN_30_DAYS = toIsoDate(now.getFullYear(), now.getMonth(), now.getDate() + 29)

export default function CardsPage() {
  const list = useListParams(FILTER_KEYS)
  const fields = useTableFields(CARDS_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<InvestorCard | null>(null)

  const query = useInvestorCardsQuery({
    page: list.page,
    pageSize: list.pageSize,
    search: list.search,
    filters: {
      ...equalsFilter('investors_id', list.filter('investor')),
      ...dateRangeFilter('expiry_date', list.filter('exp_from'), list.filter('exp_to')),
    },
    order: { created_time: -1 },
  })

  // Backend counts only. Expiry windows are just filter bounds; the backend does the counting.
  const total = useTableCount(CARDS_TABLE)
  const expired = useTableCount(CARDS_TABLE, { expiry_date: { $lt: TODAY } })
  const expiringSoon = useTableCount(CARDS_TABLE, dateRangeFilter('expiry_date', TODAY, IN_30_DAYS))

  return (
    <>
      <PageHeader
        title="Cards"
        description="Payment cards investors have linked in the app."
        actions={
          <ButtonLink to={RECORDS.cards.create} icon={Plus}>
            Add card
          </ButtonLink>
        }
      />

      <KpiGrid>
        <KpiCard label="Total cards" icon={CreditCard} tone="accent" value={total.data} />
        <KpiCard
          label="Expiring in 30 days"
          icon={CalendarClock}
          tone="warning"
          value={expiringSoon.data}
        />
        <KpiCard label="Expired" icon={CalendarX} tone="danger" value={expired.data} />
      </KpiGrid>

      <FilterBar active={!!list.search || list.hasFilters} onReset={list.resetAll}>
        <SearchInput
          value={list.searchInput}
          onChange={list.setSearchInput}
          placeholder="Card number or name"
        />
        <InvestorFilter
          value={list.filter('investor')}
          onChange={(v) => list.setFilters({ investor: v })}
        />
        <DateRangeFilter
          label={fields.fieldLabel('expiry_date')}
          from={list.filter('exp_from')}
          to={list.filter('exp_to')}
          onChange={({ from, to }) => list.setFilters({ exp_from: from, exp_to: to })}
        />
      </FilterBar>

      <DataTable
        columns={[
          ...buildColumns(fields.fieldLabel),
          actionsColumn<InvestorCard>({
            onView: (c) => navigate(RECORDS.cards.detail(c.id)),
            onEdit: (c) => navigate(RECORDS.cards.edit(c.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(c) => c.id}
        onRowClick={(c) => navigate(RECORDS.cards.detail(c.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading cards"
        emptyState={
          <ListEmptyState
            noun="cards"
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
        noun="card"
        target={toDelete && { name: toDelete.maskedPan ?? 'This card' }}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
