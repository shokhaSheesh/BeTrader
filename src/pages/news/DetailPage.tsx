import { useParams } from 'react-router'
import { NEWS_TABLE, useNewsItemQuery } from '@/entities/news'
import { RECORDS } from '@/shared/config/routes'
import { DateTimeCell, ImageCell, TextCell } from '@/shared/ui'
import { RecordDetail } from '@/widgets/record-detail'

export default function DetailPage() {
  const { id } = useParams()
  return (
    <RecordDetail
      table={NEWS_TABLE}
      noun="news item"
      query={useNewsItemQuery(id)}
      back={{ to: RECORDS.news.list, label: 'News' }}
      title={(r) => r.titleEn ?? 'News'}
      editTo={(r) => RECORDS.news.edit(r.id)}
      deleteName={(r) => r.titleEn ?? 'This news item'}
      sections={(r, L) => [
        {
          title: 'Photo',
          items: [
            { label: L('photo'), value: <ImageCell src={r.photo} size={96} /> },
            { label: L('created_time'), value: <DateTimeCell value={r.createdTime} /> },
          ],
        },
        {
          title: 'English',
          items: [
            { label: L('title_en'), value: <TextCell value={r.titleEn} /> },
            { label: L('description_en'), value: <TextCell value={r.descriptionEn} /> },
          ],
        },
        {
          title: 'Russian',
          items: [
            { label: L('title_ru'), value: <TextCell value={r.titleRu} /> },
            { label: L('description_ru'), value: <TextCell value={r.descriptionRu} /> },
          ],
        },
        {
          title: 'Uzbek',
          items: [
            { label: L('title_uz'), value: <TextCell value={r.titleUz} /> },
            { label: L('description_uz'), value: <TextCell value={r.descriptionUz} /> },
          ],
        },
      ]}
    />
  )
}
