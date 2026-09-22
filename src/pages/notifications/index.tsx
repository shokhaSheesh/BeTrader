import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import {
  NOTIFICATIONS_TABLE,
  useNotificationsQuery,
  type NotificationItem,
} from '@/entities/notification'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { useListParams } from '@/shared/hooks/useListParams'
import {
  Badge,
  ButtonLink,
  type Column,
  DataTable,
  DateTimeCell,
  FilterBar,
  ListEmptyState,
  LongTextCell,
  OptionsCell,
  PageHeader,
  Pagination,
  SearchInput,
  TextCell,
} from '@/shared/ui'

function buildColumns(
  label: (f: string) => string,
  optionLabel: (f: string, v: string) => string,
): Column<NotificationItem>[] {
  return [
    {
      id: 'title_en',
      header: `${label('title_en')} (En)`,
      skeleton: 'w-56',
      cell: (r) => (
        <span className="font-medium">
          <TextCell value={r.titleEn} />
        </span>
      ),
    },
    {
      id: 'type',
      header: label('type'),
      skeleton: 'w-14',
      cell: (r) => (
        <OptionsCell values={r.type} label={(v) => optionLabel('type', v)} field="type" />
      ),
    },
    {
      id: 'is_sent',
      header: label('is_sent'),
      skeleton: 'w-16',
      cell: (r) => (r.isSent ? <Badge tone="success">Sent</Badge> : <Badge>Not sent</Badge>),
    },
    {
      id: 'send_at',
      header: label('send_at'),
      align: 'right',
      skeleton: 'w-32',
      cell: (r) => <DateTimeCell value={r.sendAt} />,
    },
    {
      id: 'content_en',
      header: `${label('content_en')} (En)`,
      cell: (r) => <LongTextCell value={r.contentEn} />,
    },
    { id: 'link', header: label('link'), cell: (r) => <LongTextCell value={r.link} /> },
    {
      id: 'title_ru',
      header: `${label('title_ru')} (Ru)`,
      cell: (r) => <TextCell value={r.titleRu} />,
    },
    {
      id: 'title_uz',
      header: `${label('title_uz')} (Uz)`,
      cell: (r) => <TextCell value={r.titleUz} />,
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
  const fields = useTableFields(NOTIFICATIONS_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<NotificationItem | null>(null)
  const query = useNotificationsQuery({
    page: list.page,
    pageSize: list.pageSize,
    search: list.search,
  })

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Push notifications sent to investors."
        actions={
          <ButtonLink to={RECORDS.notifications.create} icon={Plus}>
            Create notification
          </ButtonLink>
        }
      />
      <FilterBar active={!!list.search || list.hasFilters} onReset={list.resetAll}>
        <SearchInput
          value={list.searchInput}
          onChange={list.setSearchInput}
          placeholder="Search notifications"
        />
      </FilterBar>
      <DataTable
        columns={[
          ...buildColumns(fields.fieldLabel, fields.optionLabel),
          actionsColumn<NotificationItem>({
            onView: (r) => navigate(RECORDS.notifications.detail(r.id)),
            onEdit: (r) => navigate(RECORDS.notifications.edit(r.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(RECORDS.notifications.detail(r.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading notifications"
        emptyState={
          <ListEmptyState
            noun="notifications"
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
        noun="notification"
        target={toDelete && { name: toDelete.titleEn ?? 'This notification' }}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
