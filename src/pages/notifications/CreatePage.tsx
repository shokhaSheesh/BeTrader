import { notWired } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
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
        onSubmit={() => notWired('create')}
      />
    </>
  )
}
