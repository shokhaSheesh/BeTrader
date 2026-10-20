import { useParams } from 'react-router'
import { DOCUMENTS_TABLE, useDocumentItemQuery } from '@/entities/document'
import { useUpdateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { investorLabel } from '@/shared/lib/format'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useDocumentItemQuery(id)
  const update = useUpdateRecord(
    { table: DOCUMENTS_TABLE, noun: 'document', routes: RECORDS.documents },
    id,
  )
  return (
    <RecordBoundary
      query={query}
      noun="document"
      back={{ to: RECORDS.documents.list, label: 'Documents' }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.documents.detail(r.id), label: 'Documents' }}
            title={'Edit document'}
          />
          <RecordForm
            spec={FORM_SPECS.documents}
            defaults={{
              investors_id: r.investorId,
              title_en: r.titleEn,
              title_ru: r.titleRu,
              title_uz: r.titleUz,
              file: r.file,
              file_en: r.fileEn,
              file_uz: r.fileUz,
            }}
            initialLabels={{
              investors_id: r.investorId
                ? investorLabel(r.investorName, r.investorPhone)
                : undefined,
            }}
            submitLabel="Save changes"
            cancelTo={RECORDS.documents.detail(r.id)}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
