import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Link2, UserCheck, Zap } from 'lucide-react'
import {
  REFERRAL_LINKS_TABLE,
  useReferralLinksQuery,
  type ReferralLink,
} from '@/entities/referral-link'
import { InvestorFilter } from '@/features/investor-filter'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { dateRangeFilter, equalsFilter } from '@/shared/api/filters'
import { useTableCount } from '@/shared/api/useTableCount'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { useListParams } from '@/shared/hooks/useListParams'
import { formatPhone } from '@/shared/lib/format'
import {
  Badge,
  CodeCell,
  DataTable,
  DateRangeFilter,
  DateTimeCell,
  FilterBar,
  FilterSelect,
  KpiCard,
  KpiGrid,
  ListEmptyState,
  PageHeader,
  Pagination,
  TextCell,
  type Column,
} from '@/shared/ui'

const FILTER_KEYS = ['sender', 'active', 'from', 'to'] as const
const ACTIVE = [
  { value: 'yes', label: 'Active' },
  { value: 'no', label: 'Inactive' },
]
const REGISTERED = { register_date: { $gte: '2000-01-01T00:00:00Z' } } // "has a registration date", counted by the backend

function buildColumns(label: (f: string) => string): Column<ReferralLink>[] {
  return [
    {
      id: 'sender',
      header: label('investors_id'),
      skeleton: 'w-44',
      cell: (r) => (
        <span className="font-medium">
          <TextCell value={r.senderName} />
        </span>
      ),
    },
    {
      id: 'send_phone_number',
      header: label('send_phone_number'),
      skeleton: 'w-32',
      cell: (r) => <CodeCell value={r.sendPhoneNumber && formatPhone(r.sendPhoneNumber)} />,
    },
    {
      id: 'send_investor_u_id',
      header: label('send_investor_u_id'),
      cell: (r) => <CodeCell value={r.sendInvestorUId} />,
    },
    {
      id: 'is_active',
      header: label('is_active'),
      skeleton: 'w-16',
      cell: (r) => (r.isActive ? <Badge tone="success">Active</Badge> : <Badge>Inactive</Badge>),
    },
    {
      id: 'entered',
      header: label('investors_id_2'),
      cell: (r) => <TextCell value={r.enteredName} />,
    },
    {
      id: 'entered_phone_number',
      header: label('entered_phone_number'),
      skeleton: 'w-32',
      cell: (r) => <CodeCell value={r.enteredPhoneNumber && formatPhone(r.enteredPhoneNumber)} />,
    },
    {
      id: 'send_at',
      header: label('send_at'),
      align: 'right',
      skeleton: 'w-32',
      cell: (r) => <DateTimeCell value={r.sendAt} />,
    },
    {
      id: 'register_date',
      header: label('register_date'),
      align: 'right',
      skeleton: 'w-32',
      cell: (r) => <DateTimeCell value={r.registerDate} />,
    },
    {
      id: 'created_at',
      header: 'Created',
      align: 'right',
      skeleton: 'w-32',
      cell: (r) => <DateTimeCell value={r.createdAt} />,
    },
  ]
}

export default function ReferralLinksPage() {
  const list = useListParams(FILTER_KEYS)
  const fields = useTableFields(REFERRAL_LINKS_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<ReferralLink | null>(null)
  const active = list.filter('active')

  // No search box: `search` returns nothing on this table (docs/API.md). Filters work.
  const query = useReferralLinksQuery({
    page: list.page,
    pageSize: list.pageSize,
    filters: {
      ...equalsFilter('investors_id', list.filter('sender')),
      ...equalsFilter('is_active', active === 'yes' ? true : active === 'no' ? false : null),
      ...dateRangeFilter('send_at', list.filter('from'), list.filter('to')),
    },
  })
  const total = useTableCount(REFERRAL_LINKS_TABLE)
  const activeCount = useTableCount(REFERRAL_LINKS_TABLE, { is_active: true })
  const registered = useTableCount(REFERRAL_LINKS_TABLE, REGISTERED)

  return (
    <>
      <PageHeader
        title="Referral links"
        description="Invites investors shared, and who joined through them."
      />
      <KpiGrid>
        <KpiCard label="Links shared" icon={Link2} tone="accent" value={total.data} />
        <KpiCard label="Active" icon={Zap} tone="success" value={activeCount.data} />
        <KpiCard
          label="Joined through a link"
          icon={UserCheck}
          tone="info"
          value={registered.data}
        />
      </KpiGrid>
      <FilterBar active={list.hasFilters} onReset={list.resetAll}>
        <InvestorFilter
          value={list.filter('sender')}
          onChange={(v) => list.setFilters({ sender: v })}
        />
        <FilterSelect
          label="Status"
          value={active}
          onChange={(v) => list.setFilters({ active: v })}
          options={ACTIVE}
        />
        <DateRangeFilter
          label={fields.fieldLabel('send_at')}
          from={list.filter('from')}
          to={list.filter('to')}
          onChange={({ from, to }) => list.setFilters({ from, to })}
        />
      </FilterBar>
      <DataTable
        columns={[
          ...buildColumns(fields.fieldLabel),
          actionsColumn<ReferralLink>({
            onView: (r) => navigate(RECORDS.referralLinks.detail(r.id)),
            onEdit: (r) => navigate(RECORDS.referralLinks.edit(r.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(RECORDS.referralLinks.detail(r.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading referral links"
        emptyState={
          <ListEmptyState
            noun="referral links"
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
        noun="referral link"
        target={
          toDelete && { name: `The link shared by ${toDelete.senderName ?? 'this investor'}` }
        }
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
