import { useNavigate } from 'react-router'
import { CircleAlert, CircleCheck, Inbox, RefreshCw } from 'lucide-react'
import { BITRIX_LEADS_TABLE, useBitrixLeadsQuery, type BitrixLead } from '@/entities/bitrix-lead'
import { InvestorFilter } from '@/features/investor-filter'
import { dateRangeFilter, equalsFilter } from '@/shared/api/filters'
import { useTableCount } from '@/shared/api/useTableCount'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { useListParams } from '@/shared/hooks/useListParams'
import { toneFor } from '@/shared/lib/tones'
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
  LongTextCell,
  PageHeader,
  Pagination,
  TextCell,
  YesNoCell,
  type Column,
} from '@/shared/ui'

const FILTER_KEYS = ['status', 'investor', 'from', 'to'] as const
// `status` is free text in the backend (no options), so these are the values the integration writes.
// Asked the backend to make it a select (docs/API.md); then this list comes from the schema.
const STATUSES = [
  { value: 'created', label: 'Created' },
  { value: 'error', label: 'Error' },
  { value: 'deposit_updated', label: 'Deposit updated' },
]
const statusLabel = (v: string | null) => STATUSES.find((s) => s.value === v)?.label ?? v

/** Read-only log of the CRM sync: request/response bodies are on the detail page. */
function buildColumns(label: (f: string) => string): Column<BitrixLead>[] {
  return [
    {
      id: 'investor',
      header: label('investors_id'),
      skeleton: 'w-44',
      cell: (r) => (
        <span className="font-medium">
          <TextCell value={r.investorName} />
        </span>
      ),
    },
    {
      id: 'status',
      header: label('status'),
      skeleton: 'w-20',
      cell: (r) =>
        r.status ? (
          <Badge tone={toneFor('status', r.status)}>{statusLabel(r.status)}</Badge>
        ) : (
          <CodeCell value={null} />
        ),
    },
    {
      id: 'phone',
      header: label('phone'),
      skeleton: 'w-32',
      cell: (r) => <CodeCell value={r.phone} />,
    },
    {
      id: 'bitrix_method',
      header: label('bitrix_method'),
      cell: (r) => <CodeCell value={r.bitrixMethod} />,
    },
    {
      id: 'http_status',
      header: label('http_status'),
      align: 'right',
      skeleton: 'w-10',
      cell: (r) => <CodeCell value={r.httpStatus} />,
    },
    {
      id: 'bitrix_lead_id',
      header: label('bitrix_lead_id'),
      cell: (r) => <CodeCell value={r.bitrixLeadId} />,
    },
    { id: 'lead_type', header: label('lead_type'), cell: (r) => <TextCell value={r.leadType} /> },
    { id: 'error', header: label('error'), cell: (r) => <LongTextCell value={r.error} /> },
    {
      id: 'deposit_synced',
      header: label('deposit_synced'),
      skeleton: 'w-8',
      cell: (r) => <YesNoCell value={r.depositSynced} />,
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

export default function BitrixLeadsPage() {
  const list = useListParams(FILTER_KEYS)
  const fields = useTableFields(BITRIX_LEADS_TABLE)
  const navigate = useNavigate()
  const query = useBitrixLeadsQuery({
    page: list.page,
    pageSize: list.pageSize,
    filters: {
      ...equalsFilter('status', list.filter('status')),
      ...equalsFilter('investors_id', list.filter('investor')),
      ...dateRangeFilter('created_at', list.filter('from'), list.filter('to')),
    },
  })
  const total = useTableCount(BITRIX_LEADS_TABLE)
  const created = useTableCount(BITRIX_LEADS_TABLE, { status: 'created' })
  const errors = useTableCount(BITRIX_LEADS_TABLE, { status: 'error' })
  const deposits = useTableCount(BITRIX_LEADS_TABLE, { status: 'deposit_updated' })

  return (
    <>
      <PageHeader
        title="Bitrix leads"
        description="Every sync of an investor to the Bitrix CRM, with the request and response."
      />
      <KpiGrid>
        <KpiCard label="Sync attempts" icon={Inbox} tone="accent" value={total.data} />
        <KpiCard label="Created" icon={CircleCheck} tone="success" value={created.data} />
        <KpiCard label="Errors" icon={CircleAlert} tone="danger" value={errors.data} />
        <KpiCard label="Deposit updated" icon={RefreshCw} tone="info" value={deposits.data} />
      </KpiGrid>
      <FilterBar active={list.hasFilters} onReset={list.resetAll}>
        <FilterSelect
          label={fields.fieldLabel('status')}
          value={list.filter('status')}
          onChange={(v) => list.setFilters({ status: v })}
          options={STATUSES}
        />
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
        columns={buildColumns(fields.fieldLabel)}
        rows={query.data?.items}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(RECORDS.bitrixLeads.detail(r.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading Bitrix leads"
        emptyState={
          <ListEmptyState
            noun="Bitrix leads"
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
    </>
  )
}
