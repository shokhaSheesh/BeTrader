import { useParams } from 'react-router'
import { NEWS_TABLE, useNewsItemQuery } from '@/entities/news'
import { useUpdateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useNewsItemQuery(id)
  const update = useUpdateRecord({ table: NEWS_TABLE, noun: 'news item', routes: RECORDS.news }, id)
  return (
    <RecordBoundary query={query} noun="news item" back={{ to: RECORDS.news.list, label: 'News' }}>
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.news.detail(r.id), label: 'News' }}
            title={r.titleEn ? `Edit ${r.titleEn}` : 'Edit news'}
          />
          <RecordForm
            spec={FORM_SPECS.news}
            defaults={{
              title_en: r.titleEn,
              title_ru: r.titleRu,
              title_uz: r.titleUz,
              description_en: r.descriptionEn,
              description_ru: r.descriptionRu,
              description_uz: r.descriptionUz,
              photo: r.photo,
            }}

            submitLabel="Save changes"
            cancelTo={RECORDS.news.detail(r.id)}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
