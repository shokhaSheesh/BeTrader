import { DOCUMENTS_TABLE } from '@/entities/document'
import { useCreateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function CreatePage() {
  const t = useT()
  const create = useCreateRecord({
    table: DOCUMENTS_TABLE,
    noun: 'document',
    routes: RECORDS.documents,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.documents.list, label: t('Documents') }}
        title={t('Add document')}
      />
      <RecordForm
        spec={FORM_SPECS.documents}
        submitLabel={t('Add document')}

        cancelTo={RECORDS.documents.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
