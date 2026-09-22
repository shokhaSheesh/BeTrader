import { CardForm } from '@/features/card-editor'
import { notWired } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CardCreatePage() {
  return (
    <>
      <PageHeader back={{ to: RECORDS.cards.list, label: 'Cards' }} title="Add card" />
      <CardForm
        submitLabel="Add card"
        cancelTo={RECORDS.cards.list}
        onSubmit={() => notWired('create')}
      />
    </>
  )
}
