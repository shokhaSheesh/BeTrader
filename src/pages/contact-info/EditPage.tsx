import { useParams } from 'react-router'
import { CONTACT_INFO_TABLE, useContactInfoQuery } from '@/entities/contact-info'
import { useUpdateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useContactInfoQuery(id)
  // A settings record: saving returns to the page that shows it
  const update = useUpdateRecord(
    {
      table: CONTACT_INFO_TABLE,
      noun: 'contact info',
      routes: { list: RECORDS.contactInfo.list, detail: () => RECORDS.contactInfo.list },
    },
    id,
  )
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
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
