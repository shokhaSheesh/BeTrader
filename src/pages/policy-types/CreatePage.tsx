import { notWired } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  return (
    <>
      <PageHeader
        back={{ to: RECORDS.policyTypes.list, label: 'Policy types' }}
        title="Add policy type"
      />
      <RecordForm
        spec={FORM_SPECS.policyTypes}
        submitLabel="Add policy type"
        cancelTo={RECORDS.policyTypes.list}
        onSubmit={() => notWired('create')}
      />
    </>
  )
}
