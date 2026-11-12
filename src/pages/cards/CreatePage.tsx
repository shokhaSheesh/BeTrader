import { CARDS_TABLE } from '@/entities/investor-card'
import { CardForm } from '@/features/card-editor'
import { useCreateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function CardCreatePage() {
  const t = useT()
  const create = useCreateRecord({ table: CARDS_TABLE, noun: 'card', routes: RECORDS.cards })

  return (
    <>
      <PageHeader back={{ to: RECORDS.cards.list, label: t('Cards') }} title={t('Add card')} />
      <CardForm
        submitLabel={t('Add card')}
        cancelTo={RECORDS.cards.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
