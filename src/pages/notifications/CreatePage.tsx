import { NOTIFICATIONS_TABLE } from '@/entities/notification'
import { useCreateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function CreatePage() {
  const t = useT()
  const create = useCreateRecord({
    table: NOTIFICATIONS_TABLE,
    noun: 'notification',
    routes: RECORDS.notifications,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.notifications.list, label: t('Notifications') }}
        title={t('Create notification')}
      />
      <RecordForm
        spec={FORM_SPECS.notifications}
        submitLabel={t('Create notification')}

        cancelTo={RECORDS.notifications.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
