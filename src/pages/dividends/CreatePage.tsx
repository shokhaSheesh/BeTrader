import { DividendForm } from '@/features/dividend-editor'
import { notWired } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  return (
    <>
      <PageHeader
        back={{ to: RECORDS.dividends.list, label: 'Dividends' }}
        title="Create dividend"
      />
      <DividendForm
        submitLabel="Create dividend"
        cancelTo={RECORDS.dividends.list}
        onSubmit={() => notWired('create')}
      />
    </>
  )
}
