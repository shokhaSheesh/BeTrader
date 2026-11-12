import { CURRENCY_RATES_TABLE } from '@/entities/currency-rate'
import { CurrencyRateForm } from '@/features/currency-rate-editor'
import { useCreateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function CreatePage() {
  const t = useT()
  const create = useCreateRecord({
    table: CURRENCY_RATES_TABLE,
    noun: 'currency rate',
    routes: RECORDS.currencyRates,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.currencyRates.list, label: t('Currency rates') }}
        title={t('Add currency rate')}
      />
      <CurrencyRateForm
        submitLabel={t('Add currency rate')}
        cancelTo={RECORDS.currencyRates.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
