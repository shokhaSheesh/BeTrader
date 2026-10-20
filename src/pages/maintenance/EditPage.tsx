import { useParams } from 'react-router'
import { MAINTENANCE_TABLE, useMaintenanceQuery } from '@/entities/maintenance'
import { useUpdateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useMaintenanceQuery(id)
  // A settings record: saving returns to the page that shows it
  const update = useUpdateRecord(
    {
      table: MAINTENANCE_TABLE,
      noun: 'maintenance works',
      routes: { list: RECORDS.maintenance.list, detail: () => RECORDS.maintenance.list },
    },
    id,
  )
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
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
