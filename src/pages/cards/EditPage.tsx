import { useParams } from 'react-router'
import { useInvestorCardQuery } from '@/entities/investor-card'
import { CardForm } from '@/features/card-editor'
import { notWired } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function CardEditPage() {
  const { id } = useParams()
  const query = useInvestorCardQuery(id)
  return (
    <RecordBoundary query={query} noun="card" back={{ to: RECORDS.cards.list, label: 'Cards' }}>
      {(c) => (
        <>
          <PageHeader
            back={{ to: RECORDS.cards.detail(c.id), label: c.maskedPan ?? 'Card' }}
            title="Edit card"
          />
          <CardForm
            card={c}
            submitLabel="Save changes"
            cancelTo={RECORDS.cards.detail(c.id)}
            onSubmit={() => notWired('save')}
          />
        </>
      )}
    </RecordBoundary>
  )
}
