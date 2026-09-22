import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { DOCUMENTS_TABLE, useDocumentsQuery, type DocumentItem } from '@/entities/document'
import { actionsColumn, DeleteRecordDialog } from '@/features/record-actions'
import { InvestorFilter } from '@/features/investor-filter'
import { equalsFilter } from '@/shared/api/filters'
import { formatPhone } from '@/shared/lib/format'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { useListParams } from '@/shared/hooks/useListParams'
import {
  ButtonLink,
  CodeCell,
  type Column,
  DataTable,
  DateTimeCell,
  FileLink,
  FilterBar,
  ListEmptyState,
  PageHeader,
  Pagination,
  SearchInput,
  TextCell,
} from '@/shared/ui'

function buildColumns(label: (f: string) => string): Column<DocumentItem>[] {
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
      id: 'phone',
      header: 'Phone',
      skeleton: 'w-32',
      cell: (r) => <CodeCell value={r.investorPhone && formatPhone(r.investorPhone)} />,
    },
    { id: 'title_en', header: label('title_en'), cell: (r) => <TextCell value={r.titleEn} /> },
    { id: 'file', header: label('file'), skeleton: 'w-40', cell: (r) => <FileLink url={r.file} /> },
    {
      id: 'file_en',
      header: label('file_en'),
      skeleton: 'w-40',
      cell: (r) => <FileLink url={r.fileEn} />,
    },
    {
      id: 'file_uz',
      header: label('file_uz'),
      skeleton: 'w-40',
      cell: (r) => <FileLink url={r.fileUz} />,
    },
    { id: 'title_ru', header: label('title_ru'), cell: (r) => <TextCell value={r.titleRu} /> },
    { id: 'title_uz', header: label('title_uz'), cell: (r) => <TextCell value={r.titleUz} /> },
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
  const list = useListParams(['investor'])
  const fields = useTableFields(DOCUMENTS_TABLE)
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<DocumentItem | null>(null)
  const query = useDocumentsQuery({
    page: list.page,
    pageSize: list.pageSize,
    search: list.search,
    filters: { ...equalsFilter('investors_id', list.filter('investor')) },
  })

  return (
    <>
      <PageHeader
        title="Documents"
        description="Agreements each investor accepted, with their PDFs."
        actions={
          <ButtonLink to={RECORDS.documents.create} icon={Plus}>
            Add document
          </ButtonLink>
        }
      />
      <FilterBar active={!!list.search || list.hasFilters} onReset={list.resetAll}>
        <SearchInput
          value={list.searchInput}
          onChange={list.setSearchInput}
          placeholder="Document title"
        />
        <InvestorFilter
          value={list.filter('investor')}
          onChange={(v) => list.setFilters({ investor: v })}
        />
      </FilterBar>
      <DataTable
        columns={[
          ...buildColumns(fields.fieldLabel),
          actionsColumn<DocumentItem>({
            onView: (r) => navigate(RECORDS.documents.detail(r.id)),
            onEdit: (r) => navigate(RECORDS.documents.edit(r.id)),
            onDelete: setToDelete,
          }),
        ]}
        rows={query.data?.items}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(RECORDS.documents.detail(r.id))}
        loading={query.isPending || fields.isPending}
        fetching={query.isFetching}
        loadingLabel="Loading documents"
        emptyState={
          <ListEmptyState
            noun="documents"
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
        noun="document"
        target={toDelete && { name: toDelete.titleEn ?? 'This document' }}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
