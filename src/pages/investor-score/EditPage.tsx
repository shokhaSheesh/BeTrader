import { useParams } from 'react-router'
import { INVESTOR_SCORE_TABLE, useInvestorScoreQuery } from '@/entities/investor-score'
import { useUpdateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { numberToText } from '@/shared/lib/form'
import { investorLabel } from '@/shared/lib/format'
import { PageHeader, RecordBoundary } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function EditPage() {
  const { id } = useParams()
  const t = useT()
  const query = useInvestorScoreQuery(id)
  const update = useUpdateRecord(
    { table: INVESTOR_SCORE_TABLE, noun: 'score', routes: RECORDS.investorScore },
    id,
  )
  return (
    <RecordBoundary
      query={query}
      noun="score"
      back={{ to: RECORDS.investorScore.list, label: t('Investor score') }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.investorScore.detail(r.id), label: t('Investor score') }}
            title={
              r.investorName ? t('Edit score of {name}', { name: r.investorName }) : t('Edit score')
            }
          />
          <RecordForm
            spec={FORM_SPECS.investorScore}
            defaults={{ investors_id: r.investorId, score: numberToText(r.score) }}
            initialLabels={{
              investors_id: r.investorId
                ? investorLabel(r.investorName, r.investorPhone)
                : undefined,
            }}
            submitLabel={t('Save changes')}

            cancelTo={RECORDS.investorScore.detail(r.id)}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
