import { CurrencyRateForm } from '@/features/currency-rate-editor'
import { notWired } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  return (
    <>
      <PageHeader
        back={{ to: RECORDS.currencyRates.list, label: 'Currency rates' }}
        title="Add currency rate"
      />
      <CurrencyRateForm
        submitLabel="Add currency rate"
        cancelTo={RECORDS.currencyRates.list}
        onSubmit={() => notWired('create')}
      />
    </>
  )
}
