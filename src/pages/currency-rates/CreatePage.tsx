import { CURRENCY_RATES_TABLE } from '@/entities/currency-rate'
import { CurrencyRateForm } from '@/features/currency-rate-editor'
import { useCreateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  const create = useCreateRecord({
    table: CURRENCY_RATES_TABLE,
    noun: 'currency rate',
    routes: RECORDS.currencyRates,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.currencyRates.list, label: 'Currency rates' }}
        title="Add currency rate"
      />
      <CurrencyRateForm
        submitLabel="Add currency rate"
        cancelTo={RECORDS.currencyRates.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
