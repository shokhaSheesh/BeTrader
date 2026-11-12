import { TRANSACTION_POLICY_TABLE } from '@/entities/transaction-policy'
import { useCreateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function CreatePage() {
  const t = useT()
  const create = useCreateRecord({
    table: TRANSACTION_POLICY_TABLE,
    noun: 'policy',
    routes: RECORDS.transactionPolicy,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.transactionPolicy.list, label: t('Transaction policy') }}
        title={t('Add policy')}
      />
      <RecordForm
        spec={FORM_SPECS.transactionPolicy}
        submitLabel={t('Add policy')}
        cancelTo={RECORDS.transactionPolicy.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
