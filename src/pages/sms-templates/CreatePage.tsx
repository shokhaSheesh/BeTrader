import { notWired } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  return (
    <>
      <PageHeader
        back={{ to: RECORDS.smsTemplates.list, label: 'SMS templates' }}
        title="Add template"
      />
      <RecordForm
        spec={FORM_SPECS.smsTemplates}
        submitLabel="Add template"
        cancelTo={RECORDS.smsTemplates.list}
        onSubmit={() => notWired('create')}
      />
    </>
  )
}
