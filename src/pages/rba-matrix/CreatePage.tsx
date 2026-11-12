import { RBA_MATRIX_TABLE } from '@/entities/rba-rule'
import { useCreateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function CreatePage() {
  const t = useT()
  const create = useCreateRecord({
    table: RBA_MATRIX_TABLE,
    noun: 'risk band',
    routes: RECORDS.rbaMatrix,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.rbaMatrix.list, label: t('RBA matrix') }}
        title={t('Add risk band')}
      />
      <RecordForm
        spec={FORM_SPECS.rbaMatrix}
        submitLabel={t('Add risk band')}

        cancelTo={RECORDS.rbaMatrix.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
