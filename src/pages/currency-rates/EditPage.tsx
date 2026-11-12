import { useParams } from 'react-router'
import { CURRENCY_RATES_TABLE, useCurrencyRateQuery } from '@/entities/currency-rate'
import { CurrencyRateForm } from '@/features/currency-rate-editor'
import { useUpdateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { formatDate } from '@/shared/lib/format'
import { PageHeader, RecordBoundary } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function EditPage() {
  const t = useT()
  const { id } = useParams()
  const query = useCurrencyRateQuery(id)
  const update = useUpdateRecord(
    { table: CURRENCY_RATES_TABLE, noun: 'currency rate', routes: RECORDS.currencyRates },
    id,
  )
  return (
    <RecordBoundary
      query={query}
      noun="currency rate"
      back={{ to: RECORDS.currencyRates.list, label: t('Currency rates') }}
    >
      {(o) => {
        const title = o.date
          ? t('Rate for {date}', { date: formatDate(o.date) })
          : t('Currency rate')
        return (
          <>
            <PageHeader
              back={{ to: RECORDS.currencyRates.detail(o.id), label: title }}
              title={
                o.date
                  ? t('Edit rate for {date}', { date: formatDate(o.date) })
                  : t('Edit currency rate')
              }
            />
            <CurrencyRateForm
              rate={o}
              submitLabel={t('Save changes')}
              cancelTo={RECORDS.currencyRates.detail(o.id)}
              submitting={update.submitting}
              onSubmit={update.submit}
            />
          </>
        )
      }}
    </RecordBoundary>
  )
}
