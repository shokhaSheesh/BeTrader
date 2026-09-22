import { notWired } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
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
        onSubmit={() => notWired('create')}
      />
    </>
  )
}
