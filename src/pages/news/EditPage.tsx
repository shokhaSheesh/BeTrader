import { useParams } from 'react-router'
import { useNewsItemQuery } from '@/entities/news'
import { notWired } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useNewsItemQuery(id)
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
            }}

            submitLabel="Save changes"
            cancelTo={RECORDS.news.detail(r.id)}
            onSubmit={() => notWired('save')}
          />
        </>
      )}
    </RecordBoundary>
  )
}
