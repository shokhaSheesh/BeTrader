import { useParams } from 'react-router'
import { INVESTORS_TABLE, useInvestorQuery } from '@/entities/investor'
import { InvestorForm } from '@/features/investor-editor'
import { useUpdateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { formatPhone } from '@/shared/lib/format'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function InvestorEditPage() {
  const { id } = useParams()
  const query = useInvestorQuery(id)
  const update = useUpdateRecord(
    { table: INVESTORS_TABLE, noun: 'investor', routes: RECORDS.investors },
    id,
  )

  return (
    <RecordBoundary
      query={query}
      noun="investor"
      back={{ to: RECORDS.investors.list, label: 'Investors' }}
    >
      {(i) => {
        const name = i.fullName ?? (i.phone ? formatPhone(i.phone) : 'investor')
        return (
          <>
            <PageHeader
              back={{ to: RECORDS.investors.detail(i.id), label: name }}
              title={`Edit ${name}`}
            />
            <InvestorForm
              investor={i}
              submitLabel="Save changes"
              cancelTo={RECORDS.investors.detail(i.id)}
              submitting={update.submitting}
              onSubmit={update.submit}
            />
          </>
        )
      }}
    </RecordBoundary>
  )
}
