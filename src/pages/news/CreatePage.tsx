import { notWired } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  return (
    <>
      <PageHeader back={{ to: RECORDS.news.list, label: 'News' }} title="Create news" />
      <RecordForm
        spec={FORM_SPECS.news}
        submitLabel="Create news"
        cancelTo={RECORDS.news.list}
        onSubmit={() => notWired('create')}
      />
    </>
  )
}
