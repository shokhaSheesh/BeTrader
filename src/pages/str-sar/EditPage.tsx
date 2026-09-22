import { useParams } from 'react-router'
import { useStrReportQuery } from '@/entities/str-report'
import { notWired } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { numberToText } from '@/shared/lib/form'
import { investorLabel } from '@/shared/lib/format'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useStrReportQuery(id)
  return (
    <RecordBoundary
      query={query}
      noun="report"
      back={{ to: RECORDS.strSar.list, label: 'STR/SAR' }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.strSar.detail(r.id), label: 'STR/SAR' }}
            title={'Edit report'}
          />
          <RecordForm
            spec={FORM_SPECS.strSar}
            defaults={{
              date: r.date?.slice(0, 10) ?? null,
              policy_Type_id: r.policyTypeId,
              last_transaction_amount: numberToText(r.lastTransactionAmount),
              investors_id: r.investorId,
              investors_id_2: r.passportInvestorId,
            }}
            initialLabels={{
              investors_id: r.investorId
                ? investorLabel(r.investorName, r.investorPhone)
                : undefined,
              investors_id_2: r.passport ?? undefined,
            }}
            submitLabel="Save changes"
            cancelTo={RECORDS.strSar.detail(r.id)}
            onSubmit={() => notWired('save')}
          />
        </>
      )}
    </RecordBoundary>
  )
}
