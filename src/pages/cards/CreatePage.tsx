import { CARDS_TABLE } from '@/entities/investor-card'
import { CardForm } from '@/features/card-editor'
import { useCreateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CardCreatePage() {
  const create = useCreateRecord({ table: CARDS_TABLE, noun: 'card', routes: RECORDS.cards })

  return (
    <>
      <PageHeader back={{ to: RECORDS.cards.list, label: 'Cards' }} title="Add card" />
      <CardForm
        submitLabel="Add card"
        cancelTo={RECORDS.cards.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
