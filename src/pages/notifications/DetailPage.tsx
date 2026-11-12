import { useParams } from 'react-router'
import { NOTIFICATIONS_TABLE, useNotificationItemQuery } from '@/entities/notification'
import { useTableFields } from '@/shared/api/useTableFields'
import { RECORDS } from '@/shared/config/routes'
import { Badge, DateTimeCell, ImageCell, OptionsCell, RichText, TextCell } from '@/shared/ui'
import { RecordDetail } from '@/widgets/record-detail'
import { useLocalized, useT } from '@/shared/i18n'

export default function DetailPage() {
  const { id } = useParams()
  const t = useT()
  const pick = useLocalized()
  const fields = useTableFields(NOTIFICATIONS_TABLE)
  return (
    <RecordDetail
      table={NOTIFICATIONS_TABLE}
      noun="notification"
      query={useNotificationItemQuery(id)}
      back={{ to: RECORDS.notifications.list, label: t('Notifications') }}
      title={(r) => pick(r.titleEn, r.titleRu) ?? t('Notification')}
      editTo={(r) => RECORDS.notifications.edit(r.id)}
      wired
      deleteName={(r) => pick(r.titleEn, r.titleRu) ?? t('This notification')}
      sections={(r, L) => [
        {
          title: t('Delivery'),
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
              value: r.isSent ? (
                <Badge tone="success">{t('Sent')}</Badge>
              ) : (
                <Badge>{t('Not sent')}</Badge>
              ),
            },
            { label: L('send_at'), value: <DateTimeCell value={r.sendAt} /> },
            { label: L('link'), value: <TextCell value={r.link} /> },
            { label: t('Image'), value: <ImageCell src={r.image} size={64} /> },
          ],
        },
        {
          title: t('English'),
          items: [
            { label: L('title_en'), value: <TextCell value={r.titleEn} /> },
            { label: L('content_en'), value: <RichText value={r.contentEn} /> },
          ],
        },
        {
          title: t('Russian'),
          items: [
            { label: L('title_ru'), value: <TextCell value={r.titleRu} /> },
            { label: L('content_ru'), value: <RichText value={r.contentRu} /> },
          ],
        },
        {
          title: t('Uzbek'),

          items: [
            { label: L('title_uz'), value: <TextCell value={r.titleUz} /> },
            { label: L('content_uz'), value: <RichText value={r.contentUz} /> },
          ],
        },
      ]}
    />
  )
}
