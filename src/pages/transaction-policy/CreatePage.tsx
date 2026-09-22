import { notWired } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  return (
    <>
      <PageHeader
        back={{ to: RECORDS.transactionPolicy.list, label: 'Transaction policy' }}
        title="Add policy"
      />
      <RecordForm
        spec={FORM_SPECS.transactionPolicy}
        submitLabel="Add policy"
        cancelTo={RECORDS.transactionPolicy.list}
        onSubmit={() => notWired('create')}
      />
    </>
  )
}
