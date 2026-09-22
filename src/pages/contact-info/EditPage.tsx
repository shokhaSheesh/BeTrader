import { useParams } from 'react-router'
import { useContactInfoQuery } from '@/entities/contact-info'
import { notWired } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useContactInfoQuery(id)
  return (
    <RecordBoundary
      query={query}
      noun="contact info"
      back={{ to: RECORDS.contactInfo.list, label: 'Contact info' }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.contactInfo.list, label: 'Contact info' }}
            title="Edit contact info"
          />
          <RecordForm
            spec={FORM_SPECS.contactInfo}
            defaults={{ phone: r.phone, telegram: r.telegram }}
            submitLabel="Save changes"
            cancelTo={RECORDS.contactInfo.list}
            onSubmit={() => notWired('save')}
          />
        </>
      )}
    </RecordBoundary>
  )
}
