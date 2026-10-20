import { EMPLOYEES_TABLE } from '@/entities/employee'
import { useCreateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  const create = useCreateRecord({
    table: EMPLOYEES_TABLE,
    noun: 'employee',
    routes: RECORDS.employees,
  })

  return (
    <>
      <PageHeader back={{ to: RECORDS.employees.list, label: 'Employees' }} title="Add employee" />
      <RecordForm
        spec={FORM_SPECS.employees}
        submitLabel="Add employee"
        cancelTo={RECORDS.employees.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
