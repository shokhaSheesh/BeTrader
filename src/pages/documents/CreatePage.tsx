import { DOCUMENTS_TABLE } from '@/entities/document'
import { useCreateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  const create = useCreateRecord({
    table: DOCUMENTS_TABLE,
    noun: 'document',
    routes: RECORDS.documents,
  })

  return (
    <>
      <PageHeader back={{ to: RECORDS.documents.list, label: 'Documents' }} title="Add document" />
      <RecordForm
        spec={FORM_SPECS.documents}
        submitLabel="Add document"
        cancelTo={RECORDS.documents.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
