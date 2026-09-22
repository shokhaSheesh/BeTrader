import { useParams } from 'react-router'
import { useMaintenanceQuery } from '@/entities/maintenance'
import { notWired } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useMaintenanceQuery(id)
  return (
    <RecordBoundary
      query={query}
      noun="maintenance works"
      back={{ to: RECORDS.maintenance.list, label: 'Maintenance works' }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.maintenance.list, label: 'Maintenance works' }}
            title="Edit maintenance works"
          />
          <RecordForm
            spec={FORM_SPECS.maintenance}
            defaults={{ maintenance_works: r.maintenanceWorks ?? false }}
            submitLabel="Save changes"
            cancelTo={RECORDS.maintenance.list}
            onSubmit={() => notWired('save')}
          />
        </>
      )}
    </RecordBoundary>
  )
}
