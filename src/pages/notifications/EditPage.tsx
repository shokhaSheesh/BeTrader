import { useParams } from 'react-router'
import { NOTIFICATIONS_TABLE, useNotificationItemQuery } from '@/entities/notification'
import { useUpdateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function EditPage() {
  const { id } = useParams()
  const t = useT()
  const query = useNotificationItemQuery(id)
  const update = useUpdateRecord(
    { table: NOTIFICATIONS_TABLE, noun: 'notification', routes: RECORDS.notifications },
    id,
  )
  return (
    <RecordBoundary
      query={query}
      noun="notification"
      back={{ to: RECORDS.notifications.list, label: t('Notifications') }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.notifications.detail(r.id), label: t('Notifications') }}
            title={t('Edit notification')}
          />
          <RecordForm
            spec={FORM_SPECS.notifications}
            defaults={{
              type: r.type,
              send_at: r.sendAt ?? null,
              link: r.link,
              is_sent: r.isSent ?? false,
              title_en: r.titleEn,
              title_ru: r.titleRu,
              title_uz: r.titleUz,
              content_en: r.contentEn,
              content_ru: r.contentRu,
              content_uz: r.contentUz,
              image: r.image,
            }}

            submitLabel={t('Save changes')}

            cancelTo={RECORDS.notifications.detail(r.id)}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
