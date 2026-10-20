import { FAQ_TABLE } from '@/entities/faq'
import { useCreateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  const create = useCreateRecord({ table: FAQ_TABLE, noun: 'question', routes: RECORDS.faq })

  return (
    <>
      <PageHeader back={{ to: RECORDS.faq.list, label: 'FAQ' }} title="Add question" />
      <RecordForm
        spec={FORM_SPECS.faq}
        submitLabel="Add question"
        cancelTo={RECORDS.faq.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
