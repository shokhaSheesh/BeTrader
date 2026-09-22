import { useParams } from 'react-router'
import { EMPLOYEES_TABLE, useEmployeeQuery } from '@/entities/employee'
import { RECORDS } from '@/shared/config/routes'
import { Badge, CodeCell, ImageCell, TextCell } from '@/shared/ui'
import { RecordDetail } from '@/widgets/record-detail'

export default function DetailPage() {
  const { id } = useParams()
  return (
    <RecordDetail
      table={EMPLOYEES_TABLE}
      noun="employee"
      query={useEmployeeQuery(id)}
      back={{ to: RECORDS.employees.list, label: 'Employees' }}
      title={(r) => (
        <span className="flex items-center gap-3">
          <ImageCell src={r.photo} round size={40} />
          <span className="num">{r.login ?? 'Employee'}</span>
        </span>
      )}
      description={(r) => (r.role ? <Badge>{r.role}</Badge> : undefined)}
      editTo={(r) => RECORDS.employees.edit(r.id)}
      deleteName={(r) => r.login ?? 'This employee'}
      sections={(r, L) => [
        {
          title: 'Account',
          items: [
            { label: L('login'), value: <CodeCell value={r.login} /> },
            { label: L('role_id'), value: <TextCell value={r.role} /> },
            { label: L('client_type_id'), value: <TextCell value={r.clientType} /> },
            { label: L('password'), value: <span className="text-fg-muted">Hidden</span> },
          ],
        },
      ]}
    />
  )
}
