import { useParams } from 'react-router'
import { INVESTOR_SCORE_TABLE, useInvestorScoreQuery } from '@/entities/investor-score'
import { useUpdateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { numberToText } from '@/shared/lib/form'
import { investorLabel } from '@/shared/lib/format'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useInvestorScoreQuery(id)
  const update = useUpdateRecord(
    { table: INVESTOR_SCORE_TABLE, noun: 'score', routes: RECORDS.investorScore },
    id,
  )
  return (
    <RecordBoundary
      query={query}
      noun="score"
      back={{ to: RECORDS.investorScore.list, label: 'Investor score' }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.investorScore.detail(r.id), label: 'Investor score' }}
            title={`Edit score of ${r.investorName ?? 'investor'}`}
          />
          <RecordForm
            spec={FORM_SPECS.investorScore}
            defaults={{ investors_id: r.investorId, score: numberToText(r.score) }}
            initialLabels={{
              investors_id: r.investorId
                ? investorLabel(r.investorName, r.investorPhone)
                : undefined,
            }}
            submitLabel="Save changes"
            cancelTo={RECORDS.investorScore.detail(r.id)}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
