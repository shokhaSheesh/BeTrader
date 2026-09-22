import { CurrencyPercentForm } from '@/features/currency-percent-editor'
import { notWired } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  return (
    <>
      <PageHeader
        back={{ to: RECORDS.currencyPercent.list, label: 'Currency percent' }}
        title="Add percent"
      />
      <CurrencyPercentForm
        submitLabel="Add percent"
        cancelTo={RECORDS.currencyPercent.list}
        onSubmit={() => notWired('create')}
      />
    </>
  )
}
