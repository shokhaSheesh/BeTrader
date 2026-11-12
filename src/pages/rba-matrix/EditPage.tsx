import { useParams } from 'react-router'
import { RBA_MATRIX_TABLE, useRbaRuleQuery } from '@/entities/rba-rule'
import { useUpdateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { numberToText } from '@/shared/lib/form'
import { PageHeader, RecordBoundary } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function EditPage() {
  const { id } = useParams()
  const t = useT()
  const query = useRbaRuleQuery(id)
  const update = useUpdateRecord(
    { table: RBA_MATRIX_TABLE, noun: 'risk band', routes: RECORDS.rbaMatrix },
    id,
  )
  return (
    <RecordBoundary
      query={query}
      noun="risk band"
      back={{ to: RECORDS.rbaMatrix.list, label: t('RBA matrix') }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.rbaMatrix.detail(r.id), label: t('RBA matrix') }}
            title={t('Edit risk band')}
          />
          <RecordForm
            spec={FORM_SPECS.rbaMatrix}
            defaults={{
              amount_from: numberToText(r.amountFrom),
              amount_to: numberToText(r.amountTo),
              score: numberToText(r.score),
            }}

            submitLabel={t('Save changes')}

            cancelTo={RECORDS.rbaMatrix.detail(r.id)}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
