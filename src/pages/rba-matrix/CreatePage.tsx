import { RBA_MATRIX_TABLE } from '@/entities/rba-rule'
import { useCreateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  const create = useCreateRecord({
    table: RBA_MATRIX_TABLE,
    noun: 'risk band',
    routes: RECORDS.rbaMatrix,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.rbaMatrix.list, label: 'RBA matrix' }}
        title="Add risk band"
      />
      <RecordForm
        spec={FORM_SPECS.rbaMatrix}
        submitLabel="Add risk band"
        cancelTo={RECORDS.rbaMatrix.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
