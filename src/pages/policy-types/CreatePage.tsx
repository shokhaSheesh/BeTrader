import { POLICY_TYPES_TABLE } from '@/entities/policy-type'
import { useCreateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function CreatePage() {
  const t = useT()
  const create = useCreateRecord({
    table: POLICY_TYPES_TABLE,
    noun: 'policy type',
    routes: RECORDS.policyTypes,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.policyTypes.list, label: t('Policy types') }}
        title={t('Add policy type')}
      />
      <RecordForm
        spec={FORM_SPECS.policyTypes}
        submitLabel={t('Add policy type')}

        cancelTo={RECORDS.policyTypes.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
