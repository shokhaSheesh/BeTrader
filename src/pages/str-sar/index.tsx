import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { STR_SAR_TABLE, useStrReportsQuery, type StrReport } from '@/entities/str-report'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { usePolicyTypeOptions } from '@/entities/policy-type'
import { dateRangeFilter, equalsFilter } from '@/shared/api/filters'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { Can } from '@/shared/permissions'
import { useListParams } from '@/shared/hooks/useListParams'
import {
  AmountCell,
  Badge,
  ButtonLink,
  CodeCell,
  type Column,
  Dash,
  DataTable,
  DateRangeFilter,
  DateTimeCell,
  FilterBar,
  FilterSelect,
  ListEmptyState,
  PageHeader,
  Pagination,
  TextCell,
} from '@/shared/ui'

function buildColumns(label: (f: string) => string): Column<StrReport>[] {
  return [
    {
      id: 'date',
      header: label('date'),
      skeleton: 'w-32',
      cell: (r) => (
        <span className="font-medium">
          <DateTimeCell value={r.date} />
        </span>
      ),
    },
    // The cause of a suspicious-activity report is something to notice: amber (DESIGN.md §5 "Color in data").
    {
      id: 'cause',
      header: label('policy_Type_id'),
      skeleton: 'w-48',
      cell: (r) => (r.cause ? <Badge tone="warning">{r.cause}</Badge> : <Dash />),
    },
    {
      id: 'last_transaction_amount',
      header: label('last_transaction_amount'),
      align: 'right',
      cell: (r) => <AmountCell value={r.lastTransactionAmount} />,
    },
    {
      id: 'investor',
      header: label('investors_id'),
      cell: (r) => <TextCell value={r.investorName} />,
    },
    {
      id: 'passport',
      header: label('investors_id_2'),
      cell: (r) => <CodeCell value={r.passport} />,
    },
    {
      id: 'created_at',
      header: 'Filed',
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
  const list = useListParams(['cause', 'from', 'to'])
  const fields = useTableFields(STR_SAR_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<StrReport | null>(null)
  const policyTypes = usePolicyTypeOptions()
  const query = useStrReportsQuery({
    page: list.page,
    pageSize: list.pageSize,
    filters: {
      ...equalsFilter('policy_Type_id', list.filter('cause')),
      ...dateRangeFilter('date', list.filter('from'), list.filter('to')),
    },
    order: { date: -1 },
  })

  return (
    <>
      <PageHeader
        title="STR/SAR"
        description="Suspicious transaction and activity reports."
        actions={
          <Can table={STR_SAR_TABLE} action="create">
            <ButtonLink to={RECORDS.strSar.create} icon={Plus}>
              File report
            </ButtonLink>
          </Can>
        }
      />
      <FilterBar active={list.hasFilters} onReset={list.resetAll}>
        <FilterSelect
          label={fields.fieldLabel('policy_Type_id')}
          value={list.filter('cause')}
          onChange={(v) => list.setFilters({ cause: v })}
          options={policyTypes.options}
        />
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
          actionsColumn<StrReport>({
            table: STR_SAR_TABLE,
            onView: (r) => navigate(RECORDS.strSar.detail(r.id)),
            onEdit: (r) => navigate(RECORDS.strSar.edit(r.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(RECORDS.strSar.detail(r.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading reports"
        emptyState={
          <ListEmptyState
            noun="reports"
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
        noun="report"
        target={
          toDelete && { name: toDelete.cause ? `The report "${toDelete.cause}"` : 'This report' }
        }
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
