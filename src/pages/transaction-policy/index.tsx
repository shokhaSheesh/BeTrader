import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import {
  TRANSACTION_POLICY_TABLE,
  useTransactionPoliciesQuery,
  type TransactionPolicy,
} from '@/entities/transaction-policy'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { Can } from '@/shared/permissions'
import { useListParams } from '@/shared/hooks/useListParams'
import {
  ButtonLink,
  type Column,
  DataTable,
  DateTimeCell,
  ListEmptyState,
  NumberCell,
  PageHeader,
  Pagination,
  TextCell,
} from '@/shared/ui'

function buildColumns(label: (f: string) => string): Column<TransactionPolicy>[] {
  return [
    {
      id: 'policy_Type_id',
      header: label('policy_Type_id'),
      skeleton: 'w-56',
      cell: (r) => (
        <span className="font-medium">
          <TextCell value={r.policyTypeLabel} />
        </span>
      ),
    },
    // Labelled "Amount (USD)" by the backend, but count limits use it too, so no currency symbol (docs/API.md).
    {
      id: 'amount',
      header: label('amount'),
      align: 'right',
      cell: (r) => <NumberCell value={r.amount} />,
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

export default function Page() {
  const list = useListParams([])
  const fields = useTableFields(TRANSACTION_POLICY_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<TransactionPolicy | null>(null)
  const query = useTransactionPoliciesQuery({ page: list.page, pageSize: list.pageSize })

  return (
    <>
      <PageHeader
        title="Transaction policy"
        description="Limits on top-ups and withdrawals: maximum amounts and how many per day or month."
        actions={
          <Can table={TRANSACTION_POLICY_TABLE} action="create">
            <ButtonLink to={RECORDS.transactionPolicy.create} icon={Plus}>
              Add policy
            </ButtonLink>
          </Can>
        }
      />
      <DataTable
        columns={[
          ...buildColumns(fields.fieldLabel),
          actionsColumn<TransactionPolicy>({
            table: TRANSACTION_POLICY_TABLE,
            onView: (r) => navigate(RECORDS.transactionPolicy.detail(r.id)),
            onEdit: (r) => navigate(RECORDS.transactionPolicy.edit(r.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(RECORDS.transactionPolicy.detail(r.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading policies"
        emptyState={
          <ListEmptyState
            noun="policies"
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
        noun="policy"
        target={toDelete && { name: toDelete.policyTypeLabel ?? 'This policy' }}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
