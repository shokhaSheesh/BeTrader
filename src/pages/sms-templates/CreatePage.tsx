import { SMS_TEMPLATES_TABLE } from '@/entities/sms-template'
import { useCreateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function CreatePage() {
  const t = useT()
  const create = useCreateRecord({
    table: SMS_TEMPLATES_TABLE,
    noun: 'template',
    routes: RECORDS.smsTemplates,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.smsTemplates.list, label: t('SMS templates') }}
        title={t('Add template')}
      />
      <RecordForm
        spec={FORM_SPECS.smsTemplates}
        submitLabel={t('Add template')}

        cancelTo={RECORDS.smsTemplates.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
