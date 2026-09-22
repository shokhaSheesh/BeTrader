import { useParams } from 'react-router'
import { useNotificationItemQuery } from '@/entities/notification'
import { notWired } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useNotificationItemQuery(id)
  return (
    <RecordBoundary
      query={query}
      noun="notification"
      back={{ to: RECORDS.notifications.list, label: 'Notifications' }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.notifications.detail(r.id), label: 'Notifications' }}
            title={'Edit notification'}
          />
          <RecordForm
            spec={FORM_SPECS.notifications}
            defaults={{
              type: r.type,
              send_at: r.sendAt?.slice(0, 10) ?? null,
              link: r.link,
              is_sent: r.isSent ?? false,
              title_en: r.titleEn,
              title_ru: r.titleRu,
              title_uz: r.titleUz,
              content_en: r.contentEn,
              content_ru: r.contentRu,
              content_uz: r.contentUz,
            }}

            submitLabel="Save changes"
            cancelTo={RECORDS.notifications.detail(r.id)}
            onSubmit={() => notWired('save')}
          />
        </>
      )}
    </RecordBoundary>
  )
}
