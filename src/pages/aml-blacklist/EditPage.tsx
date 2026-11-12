import { useParams } from 'react-router'
import { BLACKLIST_TABLE, useBlacklistEntryQuery } from '@/entities/blacklist-entry'
import { useUpdateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function EditPage() {
  const { id } = useParams()
  const t = useT()
  const query = useBlacklistEntryQuery(id)
  const update = useUpdateRecord(
    { table: BLACKLIST_TABLE, noun: 'entry', routes: RECORDS.amlBlacklist },
    id,
  )
  return (
    <RecordBoundary
      query={query}
      noun="entry"
      back={{ to: RECORDS.amlBlacklist.list, label: t('AML blacklist') }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.amlBlacklist.detail(r.id), label: t('AML blacklist') }}
            title={r.name ? t('Edit {name}', { name: r.name }) : t('Edit entry')}
          />
          <RecordForm
            spec={FORM_SPECS.amlBlacklist}
            defaults={{ name: r.name, surname: r.surname, passport: r.passport, pin: r.pin }}

            submitLabel={t('Save changes')}

            cancelTo={RECORDS.amlBlacklist.detail(r.id)}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
