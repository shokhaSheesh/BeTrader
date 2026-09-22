import { CircleCheck, Wrench } from 'lucide-react'
import { MAINTENANCE_TABLE, useMaintenanceItemsQuery } from '@/entities/maintenance'
import { RECORDS } from '@/shared/config/routes'
import { YesNoCell } from '@/shared/ui'
import { SingletonDetail } from '@/widgets/record-detail'

/** Single-record settings page: the table holds one row, so no list, create or delete. */
export default function Page() {
  const query = useMaintenanceItemsQuery({ page: 1, pageSize: 1 })
  return (
    <SingletonDetail
      table={MAINTENANCE_TABLE}
      title="Maintenance works"
      description="Switch the Niyat app into maintenance mode."
      query={query}
      editTo={(r) => RECORDS.maintenance.edit(r.id)}
      lead={(r) => (
        <div
          role="status"
          className={
            r.maintenanceWorks
              ? 'flex items-center gap-3 rounded-md bg-warning-tint px-5 py-4 text-warning-text'
              : 'flex items-center gap-3 rounded-md bg-success-tint px-5 py-4 text-success-text'
          }
        >
          {r.maintenanceWorks ? <Wrench size={20} /> : <CircleCheck size={20} />}
          <span className="font-medium">
            {r.maintenanceWorks
              ? 'Maintenance mode is on: investors see a maintenance screen in the app.'
              : 'The app is running normally.'}
          </span>
        </div>
      )}
      sections={(r, L) => [
        {
          title: 'App status',
          items: [
            { label: L('maintenance_works'), value: <YesNoCell value={r.maintenanceWorks} /> },
          ],
        },
      ]}
    />
  )
}
