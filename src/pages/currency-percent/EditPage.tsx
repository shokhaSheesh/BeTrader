import { useParams } from 'react-router'
import { CURRENCY_PERCENT_TABLE, useCurrencyPercentQuery } from '@/entities/currency-percent'
import { CurrencyPercentForm } from '@/features/currency-percent-editor'
import { useUpdateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useCurrencyPercentQuery(id)
  const update = useUpdateRecord(
    { table: CURRENCY_PERCENT_TABLE, noun: 'percent', routes: RECORDS.currencyPercent },
    id,
  )
  return (
    <RecordBoundary
      query={query}
      noun="percent"
      back={{ to: RECORDS.currencyPercent.list, label: 'Currency percent' }}
    >
      {(o) => {
        const title = 'Percent'
        return (
          <>
            <PageHeader
              back={{ to: RECORDS.currencyPercent.detail(o.id), label: title }}
              title={'Edit percent'}
            />
            <CurrencyPercentForm
              item={o}
              submitLabel="Save changes"
              cancelTo={RECORDS.currencyPercent.detail(o.id)}
              submitting={update.submitting}
              onSubmit={update.submit}
            />
          </>
        )
      }}
    </RecordBoundary>
  )
}
