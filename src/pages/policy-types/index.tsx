import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { POLICY_TYPES_TABLE, usePolicyTypesQuery, type PolicyType } from '@/entities/policy-type'
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
  PageHeader,
  Pagination,
  TextCell,
} from '@/shared/ui'

function buildColumns(label: (f: string) => string): Column<PolicyType>[] {
  return [
    {
      id: 'label_en',
      header: label('label_en'),
      skeleton: 'w-56',
      cell: (r) => (
        <span className="font-medium">
          <TextCell value={r.labelEn} />
        </span>
      ),
    },
    {
      id: 'label_ru',
      header: label('label_ru'),
      skeleton: 'w-56',
      cell: (r) => <TextCell value={r.labelRu} />,
    },
    {
      id: 'label_uz',
      header: label('label_uz'),
      skeleton: 'w-56',
      cell: (r) => <TextCell value={r.labelUz} />,
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
  const fields = useTableFields(POLICY_TYPES_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<PolicyType | null>(null)
  const query = usePolicyTypesQuery({ page: list.page, pageSize: list.pageSize })

  return (
    <>
      <PageHeader
        title="Policy types"
        description="The kinds of limits used by transaction policies and STR/SAR reports."
        actions={
          <Can table={POLICY_TYPES_TABLE} action="create">
            <ButtonLink to={RECORDS.policyTypes.create} icon={Plus}>
              Add policy type
            </ButtonLink>
          </Can>
        }
      />
      <DataTable
        columns={[
          ...buildColumns(fields.fieldLabel),
          actionsColumn<PolicyType>({
            table: POLICY_TYPES_TABLE,
            onView: (r) => navigate(RECORDS.policyTypes.detail(r.id)),
            onEdit: (r) => navigate(RECORDS.policyTypes.edit(r.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(RECORDS.policyTypes.detail(r.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading policy types"
        emptyState={
          <ListEmptyState
            noun="policy types"
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
        noun="policy type"
        target={toDelete && { name: toDelete.labelEn ?? 'This policy type' }}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
