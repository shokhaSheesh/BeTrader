import { DIVIDENDS_TABLE } from '@/entities/dividend'
import { DividendForm } from '@/features/dividend-editor'
import { useCreateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  const create = useCreateRecord({
    table: DIVIDENDS_TABLE,
    noun: 'dividend',
    routes: RECORDS.dividends,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.dividends.list, label: 'Dividends' }}
        title="Create dividend"
      />
      <DividendForm
        submitLabel="Create dividend"
        cancelTo={RECORDS.dividends.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
