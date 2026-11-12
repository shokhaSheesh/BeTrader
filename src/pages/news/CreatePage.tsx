import { NEWS_TABLE } from '@/entities/news'
import { useCreateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function CreatePage() {
  const t = useT()
  const create = useCreateRecord({ table: NEWS_TABLE, noun: 'news item', routes: RECORDS.news })

  return (
    <>
      <PageHeader back={{ to: RECORDS.news.list, label: t('News') }} title={t('Create news')} />
      <RecordForm
        spec={FORM_SPECS.news}
        submitLabel={t('Create news')}

        cancelTo={RECORDS.news.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
