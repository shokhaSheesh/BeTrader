import { useParams } from 'react-router'
import { EMPLOYEES_TABLE, useEmployeeQuery } from '@/entities/employee'
import { useUpdateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useEmployeeQuery(id)
  const update = useUpdateRecord(
    { table: EMPLOYEES_TABLE, noun: 'employee', routes: RECORDS.employees },
    id,
  )
  return (
    <RecordBoundary
      query={query}
      noun="employee"
      back={{ to: RECORDS.employees.list, label: 'Employees' }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.employees.detail(r.id), label: r.login ?? 'Employee' }}
            title={`Edit ${r.login ?? 'employee'}`}
          />
          {/* The password is never prefilled: empty means "keep the current one". */}
          <RecordForm
            spec={FORM_SPECS.employees}
            defaults={{
              login: r.login,
              password: '',
              role_id: r.roleId,
              client_type_id: r.clientTypeId,
              photo: r.photo,
            }}
            submitLabel="Save changes"
            cancelTo={RECORDS.employees.detail(r.id)}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
