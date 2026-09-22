import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { NEWS_TABLE, useNewsQuery, type NewsItem } from '@/entities/news'
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
  ImageCell,
  ListEmptyState,
  LongTextCell,
  PageHeader,
  Pagination,
  TextCell,
} from '@/shared/ui'

function buildColumns(label: (f: string) => string): Column<NewsItem>[] {
  return [
    {
      id: 'title_en',
      header: label('title_en'),
      skeleton: 'w-56',
      cell: (r) => (
        <span className="flex items-center gap-3">
          <ImageCell src={r.photo} />
          <span className="font-medium">
            <TextCell value={r.titleEn} />
          </span>
        </span>
      ),
    },
    {
      id: 'description_en',
      header: label('description_en'),
      cell: (r) => <LongTextCell value={r.descriptionEn} />,
    },
    { id: 'title_ru', header: label('title_ru'), cell: (r) => <TextCell value={r.titleRu} /> },
    { id: 'title_uz', header: label('title_uz'), cell: (r) => <TextCell value={r.titleUz} /> },
    {
      id: 'created_time',
      header: label('created_time'),
      align: 'right',
      skeleton: 'w-32',
      cell: (r) => <DateTimeCell value={r.createdTime} />,
    },
  ]
}

export default function Page() {
  const list = useListParams([])
  const fields = useTableFields(NEWS_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<NewsItem | null>(null)
  const query = useNewsQuery({
    page: list.page,
    pageSize: list.pageSize,
    order: { created_time: -1 },
  })

  return (
    <>
      <PageHeader
        title="News"
        description="Articles shown in the Niyat app."
        actions={
          <Can table={NEWS_TABLE} action="create">
            <ButtonLink to={RECORDS.news.create} icon={Plus}>
              Create news
            </ButtonLink>
          </Can>
        }
      />
      <DataTable
        columns={[
          ...buildColumns(fields.fieldLabel),
          actionsColumn<NewsItem>({
            table: NEWS_TABLE,
            onView: (r) => navigate(RECORDS.news.detail(r.id)),
            onEdit: (r) => navigate(RECORDS.news.edit(r.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(RECORDS.news.detail(r.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading news"
        emptyState={
          <ListEmptyState
            noun="news"
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
        noun="news item"
        target={toDelete && { name: toDelete.titleEn ?? 'This news item' }}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
