import { BLACKLIST_TABLE } from '@/entities/blacklist-entry'
import { useCreateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function CreatePage() {
  const t = useT()
  const create = useCreateRecord({
    table: BLACKLIST_TABLE,
    noun: 'entry',
    routes: RECORDS.amlBlacklist,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.amlBlacklist.list, label: t('AML blacklist') }}
        title={t('Add to blacklist')}
      />
      <RecordForm
        spec={FORM_SPECS.amlBlacklist}
        submitLabel={t('Add to blacklist')}

        cancelTo={RECORDS.amlBlacklist.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
