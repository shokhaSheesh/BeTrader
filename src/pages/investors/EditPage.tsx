import { useParams } from 'react-router'
import { INVESTORS_TABLE, useInvestorQuery } from '@/entities/investor'
import { InvestorForm } from '@/features/investor-editor'
import { useUpdateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { formatPhone } from '@/shared/lib/format'
import { PageHeader, RecordBoundary } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function InvestorEditPage() {
  const t = useT()
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
      back={{ to: RECORDS.investors.list, label: t('Investors') }}
    >
      {(i) => {
        const name = i.fullName ?? (i.phone ? formatPhone(i.phone) : t('Investor'))
        return (
          <>
            <PageHeader
              back={{ to: RECORDS.investors.detail(i.id), label: name }}
              title={t('Edit {name}', { name })}
            />
            <InvestorForm
              investor={i}
              submitLabel={t('Save changes')}
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
