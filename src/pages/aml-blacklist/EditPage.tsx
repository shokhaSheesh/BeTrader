import { useParams } from 'react-router'
import { useBlacklistEntryQuery } from '@/entities/blacklist-entry'
import { notWired } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useBlacklistEntryQuery(id)
  return (
    <RecordBoundary
      query={query}
      noun="entry"
      back={{ to: RECORDS.amlBlacklist.list, label: 'AML blacklist' }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.amlBlacklist.detail(r.id), label: 'AML blacklist' }}
            title={`Edit ${r.name ?? 'entry'}`}
          />
          <RecordForm
            spec={FORM_SPECS.amlBlacklist}
            defaults={{ name: r.name, surname: r.surname, passport: r.passport, pin: r.pin }}

            submitLabel="Save changes"
            cancelTo={RECORDS.amlBlacklist.detail(r.id)}
            onSubmit={() => notWired('save')}
          />
        </>
      )}
    </RecordBoundary>
  )
}
