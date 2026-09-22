import { notWired } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  return (
    <>
      <PageHeader back={{ to: RECORDS.employees.list, label: 'Employees' }} title="Add employee" />
      <RecordForm
        spec={FORM_SPECS.employees}
        submitLabel="Add employee"
        cancelTo={RECORDS.employees.list}
        onSubmit={() => notWired('create')}
      />
    </>
  )
}
