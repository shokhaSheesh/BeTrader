import { DIVIDENDS_TABLE } from '@/entities/dividend'
import { DividendForm } from '@/features/dividend-editor'
import { useCreateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function CreatePage() {
  const t = useT()
  const create = useCreateRecord({
    table: DIVIDENDS_TABLE,
    noun: 'dividend',
    routes: RECORDS.dividends,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.dividends.list, label: t('Dividends') }}
        title={t('Create dividend')}
      />
      <DividendForm
        submitLabel={t('Create dividend')}
        cancelTo={RECORDS.dividends.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
