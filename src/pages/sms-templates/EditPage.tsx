import { useParams } from 'react-router'
import { useSmsTemplateQuery } from '@/entities/sms-template'
import { notWired } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useSmsTemplateQuery(id)
  return (
    <RecordBoundary
      query={query}
      noun="template"
      back={{ to: RECORDS.smsTemplates.list, label: 'SMS templates' }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.smsTemplates.detail(r.id), label: 'SMS templates' }}
            title={'Edit template'}
          />
          <RecordForm
            spec={FORM_SPECS.smsTemplates}
            defaults={{ en: r.en, ru: r.ru, uz: r.uz, text: r.text }}

            submitLabel="Save changes"
            cancelTo={RECORDS.smsTemplates.detail(r.id)}
            onSubmit={() => notWired('save')}
          />
        </>
      )}
    </RecordBoundary>
  )
}
