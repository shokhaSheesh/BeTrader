import { CURRENCY_PERCENT_TABLE } from '@/entities/currency-percent'
import { CurrencyPercentForm } from '@/features/currency-percent-editor'
import { useCreateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  const create = useCreateRecord({
    table: CURRENCY_PERCENT_TABLE,
    noun: 'percent',
    routes: RECORDS.currencyPercent,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.currencyPercent.list, label: 'Currency percent' }}
        title="Add percent"
      />
      <CurrencyPercentForm
        submitLabel="Add percent"
        cancelTo={RECORDS.currencyPercent.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
