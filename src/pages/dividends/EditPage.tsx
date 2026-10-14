import { useParams } from 'react-router'
import { DIVIDENDS_TABLE, useDividendQuery } from '@/entities/dividend'
import { DividendForm } from '@/features/dividend-editor'
import { useUpdateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useDividendQuery(id)
  const update = useUpdateRecord(
    { table: DIVIDENDS_TABLE, noun: 'dividend', routes: RECORDS.dividends },
    id,
  )
  return (
    <RecordBoundary
      query={query}
      noun="dividend"
      back={{ to: RECORDS.dividends.list, label: 'Dividends' }}
    >
      {(o) => {
        const title = o.investorName ?? 'Dividend'
        return (
          <>
            <PageHeader
              back={{ to: RECORDS.dividends.detail(o.id), label: title }}
              title={'Edit dividend'}
            />
            <DividendForm
              dividend={o}
              submitLabel="Save changes"
              cancelTo={RECORDS.dividends.detail(o.id)}
              submitting={update.submitting}
              onSubmit={update.submit}
            />
          </>
        )
      }}
    </RecordBoundary>
  )
}
