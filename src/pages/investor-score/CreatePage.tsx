import { INVESTOR_SCORE_TABLE } from '@/entities/investor-score'
import { useCreateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  const create = useCreateRecord({
    table: INVESTOR_SCORE_TABLE,
    noun: 'score',
    routes: RECORDS.investorScore,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.investorScore.list, label: 'Investor score' }}
        title="Add score"
      />
      <RecordForm
        spec={FORM_SPECS.investorScore}
        submitLabel="Add score"
        cancelTo={RECORDS.investorScore.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
