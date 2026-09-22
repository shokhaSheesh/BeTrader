import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { FAQ_TABLE, useFaqItemsQuery, type FaqItem } from '@/entities/faq'
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
  TextCell,
} from '@/shared/ui'

function buildColumns(label: (f: string) => string): Column<FaqItem>[] {
  return [
    {
      id: 'question_en',
      header: `${label('question_en')} (En)`,
      skeleton: 'w-72',
      cell: (r) => (
        <span className="font-medium">
          <TextCell value={r.questionEn} />
        </span>
      ),
    },
    {
      id: 'answer_en',
      header: `${label('answer_en')} (En)`,
      cell: (r) => <LongTextCell value={r.answerEn} />,
    },
    {
      id: 'question_ru',
      header: `${label('question_ru')} (Ru)`,
      cell: (r) => <TextCell value={r.questionRu} />,
    },
    {
      id: 'question_uz',
      header: `${label('question_uz')} (Uz)`,
      cell: (r) => <TextCell value={r.questionUz} />,
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
  const fields = useTableFields(FAQ_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<FaqItem | null>(null)
  const query = useFaqItemsQuery({ page: list.page, pageSize: list.pageSize, search: list.search })

  return (
    <>
      <PageHeader
        title="FAQ"
        description="Questions and answers shown in the app."
        actions={
          <Can table={FAQ_TABLE} action="create">
            <ButtonLink to={RECORDS.faq.create} icon={Plus}>
              Add question
            </ButtonLink>
          </Can>
        }
      />
      <FilterBar active={!!list.search || list.hasFilters} onReset={list.resetAll}>
        <SearchInput
          value={list.searchInput}
          onChange={list.setSearchInput}
          placeholder="Search questions"
        />
      </FilterBar>
      <DataTable
        columns={[
          ...buildColumns(fields.fieldLabel),
          actionsColumn<FaqItem>({
            table: FAQ_TABLE,
            onView: (r) => navigate(RECORDS.faq.detail(r.id)),
            onEdit: (r) => navigate(RECORDS.faq.edit(r.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(RECORDS.faq.detail(r.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading questions"
        emptyState={
          <ListEmptyState
            noun="questions"
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
        noun="question"
        target={toDelete && { name: toDelete.questionEn ?? 'This question' }}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
