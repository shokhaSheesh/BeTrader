import { useParams } from 'react-router'
import { NOTIFICATIONS_TABLE, useNotificationItemQuery } from '@/entities/notification'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { Badge, DateTimeCell, ImageCell, OptionsCell, TextCell } from '@/shared/ui'
import { RecordDetail } from '@/widgets/record-detail'

export default function DetailPage() {
  const { id } = useParams()
  const fields = useTableFields(NOTIFICATIONS_TABLE)
  return (
    <RecordDetail
      table={NOTIFICATIONS_TABLE}
      noun="notification"
      query={useNotificationItemQuery(id)}
      back={{ to: RECORDS.notifications.list, label: 'Notifications' }}
      title={(r) => r.titleEn ?? 'Notification'}
      editTo={(r) => RECORDS.notifications.edit(r.id)}
      deleteName={(r) => r.titleEn ?? 'This notification'}
      sections={(r, L) => [
        {
          title: 'Delivery',
          items: [
            {
              label: L('type'),
              value: (
                <OptionsCell
                  values={r.type}
                  label={(v) => fields.optionLabel('type', v)}
                  field="type"
                />
              ),
            },
            {
              label: L('is_sent'),
              value: r.isSent ? <Badge tone="success">Sent</Badge> : <Badge>Not sent</Badge>,
            },
            { label: L('send_at'), value: <DateTimeCell value={r.sendAt} /> },
            { label: L('link'), value: <TextCell value={r.link} /> },
            { label: 'Image', value: <ImageCell src={r.image} size={64} /> },
          ],
        },
        {
          title: 'English',
          items: [
            { label: L('title_en'), value: <TextCell value={r.titleEn} /> },
            { label: L('content_en'), value: <TextCell value={r.contentEn} /> },
          ],
        },
        {
          title: 'Russian',
          items: [
            { label: L('title_ru'), value: <TextCell value={r.titleRu} /> },
            { label: L('content_ru'), value: <TextCell value={r.contentRu} /> },
          ],
        },
        {
          title: 'Uzbek',
          items: [
            { label: L('title_uz'), value: <TextCell value={r.titleUz} /> },
            { label: L('content_uz'), value: <TextCell value={r.contentUz} /> },
          ],
        },
      ]}
    />
  )
}
