import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import {
  SMS_TEMPLATES_TABLE,
  useSmsTemplatesQuery,
  type SmsTemplate,
} from '@/entities/sms-template'
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
  FilterBar,
  ListEmptyState,
  LongTextCell,
  PageHeader,
  Pagination,
  SearchInput,
} from '@/shared/ui'

function buildColumns(label: (f: string) => string): Column<SmsTemplate>[] {
  return [
    {
      id: 'en',
      header: label('en'),
      skeleton: 'w-72',
      cell: (r) => (
        <span className="font-medium">
          <LongTextCell value={r.en} />
        </span>
      ),
    },
    { id: 'ru', header: label('ru'), cell: (r) => <LongTextCell value={r.ru} /> },
    { id: 'uz', header: label('uz'), cell: (r) => <LongTextCell value={r.uz} /> },
    { id: 'text', header: label('text'), cell: (r) => <LongTextCell value={r.text} /> },
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
  const fields = useTableFields(SMS_TEMPLATES_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<SmsTemplate | null>(null)
  const query = useSmsTemplatesQuery({
    page: list.page,
    pageSize: list.pageSize,
    search: list.search,
  })

  return (
    <>
      <PageHeader
        title="SMS templates"
        description="Texts of the SMS messages the platform sends."
        actions={
          <Can table={SMS_TEMPLATES_TABLE} action="create">
            <ButtonLink to={RECORDS.smsTemplates.create} icon={Plus}>
              Add template
            </ButtonLink>
          </Can>
        }
      />
      <FilterBar active={!!list.search || list.hasFilters} onReset={list.resetAll}>
        <SearchInput
          value={list.searchInput}
          onChange={list.setSearchInput}
          placeholder="Search templates"
        />
      </FilterBar>
      <DataTable
        columns={[
          ...buildColumns(fields.fieldLabel),
          actionsColumn<SmsTemplate>({
            table: SMS_TEMPLATES_TABLE,
            onView: (r) => navigate(RECORDS.smsTemplates.detail(r.id)),
            onEdit: (r) => navigate(RECORDS.smsTemplates.edit(r.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(RECORDS.smsTemplates.detail(r.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading SMS templates"
        emptyState={
          <ListEmptyState
            noun="SMS templates"
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
        noun="template"
        target={toDelete && { name: toDelete.en ?? 'This template' }}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
