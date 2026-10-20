import { SMS_TEMPLATES_TABLE } from '@/entities/sms-template'
import { useCreateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  const create = useCreateRecord({
    table: SMS_TEMPLATES_TABLE,
    noun: 'template',
    routes: RECORDS.smsTemplates,
  })

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
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
