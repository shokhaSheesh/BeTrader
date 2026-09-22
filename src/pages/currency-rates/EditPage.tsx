import { useParams } from 'react-router'
import { useCurrencyRateQuery } from '@/entities/currency-rate'
import { CurrencyRateForm } from '@/features/currency-rate-editor'
import { notWired } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { formatDate } from '@/shared/lib/format'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useCurrencyRateQuery(id)
  return (
    <RecordBoundary
      query={query}
      noun="currency rate"
      back={{ to: RECORDS.currencyRates.list, label: 'Currency rates' }}
    >
      {(o) => {
        const title = o.date ? `Rate for ${formatDate(o.date)}` : 'Currency rate'
        return (
          <>
            <PageHeader
              back={{ to: RECORDS.currencyRates.detail(o.id), label: title }}
              title={o.date ? `Edit rate for ${formatDate(o.date)}` : 'Edit currency rate'}
            />
            <CurrencyRateForm
              rate={o}
              submitLabel="Save changes"
              cancelTo={RECORDS.currencyRates.detail(o.id)}
              onSubmit={() => notWired('save')}
            />
          </>
        )
      }}
    </RecordBoundary>
  )
}
