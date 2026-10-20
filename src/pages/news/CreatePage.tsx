import { NEWS_TABLE } from '@/entities/news'
import { useCreateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  const create = useCreateRecord({ table: NEWS_TABLE, noun: 'news item', routes: RECORDS.news })

  return (
    <>
      <PageHeader back={{ to: RECORDS.news.list, label: 'News' }} title="Create news" />
      <RecordForm
        spec={FORM_SPECS.news}
        submitLabel="Create news"
        cancelTo={RECORDS.news.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
