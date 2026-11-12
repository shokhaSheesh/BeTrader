import { useParams } from 'react-router'
import { SMS_TEMPLATES_TABLE, useSmsTemplateQuery } from '@/entities/sms-template'
import { useUpdateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function EditPage() {
  const { id } = useParams()
  const t = useT()
  const query = useSmsTemplateQuery(id)
  const update = useUpdateRecord(
    { table: SMS_TEMPLATES_TABLE, noun: 'template', routes: RECORDS.smsTemplates },
    id,
  )
  return (
    <RecordBoundary
      query={query}
      noun="template"
      back={{ to: RECORDS.smsTemplates.list, label: t('SMS templates') }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.smsTemplates.detail(r.id), label: t('SMS templates') }}
            title={t('Edit template')}
          />
          <RecordForm
            spec={FORM_SPECS.smsTemplates}
            defaults={{ en: r.en, ru: r.ru, uz: r.uz, text: r.text }}

            submitLabel={t('Save changes')}

            cancelTo={RECORDS.smsTemplates.detail(r.id)}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
