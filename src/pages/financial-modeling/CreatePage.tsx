import { notWired } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  return (
    <>
      <PageHeader
        back={{ to: RECORDS.financialModeling.list, label: 'Financial modeling' }}
        title="Add price"
      />
      <RecordForm
        spec={FORM_SPECS.financialModeling}
        submitLabel="Add price"
        cancelTo={RECORDS.financialModeling.list}
        onSubmit={() => notWired('create')}
      />
    </>
  )
}
