import { EMPLOYEES_TABLE } from '@/entities/employee'
import { useCreateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function CreatePage() {
  const t = useT()
  const create = useCreateRecord({
    table: EMPLOYEES_TABLE,
    noun: 'employee',
    routes: RECORDS.employees,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.employees.list, label: t('Employees') }}
        title={t('Add employee')}
      />
      <RecordForm
        spec={FORM_SPECS.employees}
        submitLabel={t('Add employee')}

        cancelTo={RECORDS.employees.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
