import { FINANCIAL_MODELING_TABLE } from '@/entities/financial-model'
import { useCreateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function CreatePage() {
  const t = useT()
  const create = useCreateRecord({
    table: FINANCIAL_MODELING_TABLE,
    noun: 'price',
    routes: RECORDS.financialModeling,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.financialModeling.list, label: t('Financial modeling') }}
        title={t('Add price')}
      />
      <RecordForm
        spec={FORM_SPECS.financialModeling}
        submitLabel={t('Add price')}
        cancelTo={RECORDS.financialModeling.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
