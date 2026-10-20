import { NOTIFICATIONS_TABLE } from '@/entities/notification'
import { useCreateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  const create = useCreateRecord({
    table: NOTIFICATIONS_TABLE,
    noun: 'notification',
    routes: RECORDS.notifications,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.notifications.list, label: 'Notifications' }}
        title="Create notification"
      />
      <RecordForm
        spec={FORM_SPECS.notifications}
        submitLabel="Create notification"
        cancelTo={RECORDS.notifications.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
