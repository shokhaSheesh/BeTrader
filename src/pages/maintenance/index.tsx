import { CircleCheck, Wrench } from 'lucide-react'
import { MAINTENANCE_TABLE, useMaintenanceItemsQuery } from '@/entities/maintenance'
import { RECORDS } from '@/shared/config/routes'
import { YesNoCell } from '@/shared/ui'
import { SingletonDetail } from '@/widgets/record-detail'
import { useT } from '@/shared/i18n'

/** Single-record settings page: the table holds one row, so no list, create or delete. */
export default function Page() {
  const t = useT()
  const query = useMaintenanceItemsQuery({ page: 1, pageSize: 1 })
  return (
    <SingletonDetail
      table={MAINTENANCE_TABLE}
      title={t('Maintenance works')}
      description={t('Switch the Niyat app into maintenance mode.')}
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
              ? t('Maintenance mode is on: investors see a maintenance screen in the app.')
              : t('The app is running normally.')}
          </span>
        </div>
      )}
      sections={(r, L) => [
        {
          title: t('App status'),

          items: [
            { label: L('maintenance_works'), value: <YesNoCell value={r.maintenanceWorks} /> },
          ],
        },
      ]}
    />
  )
}
