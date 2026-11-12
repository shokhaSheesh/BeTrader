import { useParams } from 'react-router'
import { NEWS_TABLE, useNewsItemQuery } from '@/entities/news'
import { RECORDS } from '@/shared/config/routes'
import { DateTimeCell, ImageCell, RichText, TextCell } from '@/shared/ui'
import { RecordDetail } from '@/widgets/record-detail'
import { useLocalized, useT } from '@/shared/i18n'

export default function DetailPage() {
  const { id } = useParams()
  const t = useT()
  const pick = useLocalized()
  return (
    <RecordDetail
      table={NEWS_TABLE}
      noun="news item"
      query={useNewsItemQuery(id)}
      back={{ to: RECORDS.news.list, label: t('News') }}
      title={(r) => pick(r.titleEn, r.titleRu) ?? t('News')}
      editTo={(r) => RECORDS.news.edit(r.id)}
      wired
      deleteName={(r) => pick(r.titleEn, r.titleRu) ?? t('This news item')}
      sections={(r, L) => [
        {
          title: t('Photo'),
          items: [
            { label: L('photo'), value: <ImageCell src={r.photo} size={96} /> },
            { label: L('created_time'), value: <DateTimeCell value={r.createdTime} /> },
          ],
        },
        {
          title: t('English'),
          items: [
            { label: L('title_en'), value: <TextCell value={r.titleEn} /> },
            { label: L('description_en'), value: <RichText value={r.descriptionEn} /> },
          ],
        },
        {
          title: t('Russian'),
          items: [
            { label: L('title_ru'), value: <TextCell value={r.titleRu} /> },
            { label: L('description_ru'), value: <RichText value={r.descriptionRu} /> },
          ],
        },
        {
          title: t('Uzbek'),

          items: [
            { label: L('title_uz'), value: <TextCell value={r.titleUz} /> },
            { label: L('description_uz'), value: <RichText value={r.descriptionUz} /> },
          ],
        },
      ]}
    />
  )
}
