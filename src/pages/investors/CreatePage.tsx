import { INVESTORS_TABLE } from '@/entities/investor'
import { InvestorForm } from '@/features/investor-editor'
import { useCreateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function InvestorCreatePage() {
  const create = useCreateRecord({
    table: INVESTORS_TABLE,
    noun: 'investor',
    routes: RECORDS.investors,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.investors.list, label: 'Investors' }}
        title="Create investor"
      />
      <InvestorForm
        submitLabel="Create investor"
        cancelTo={RECORDS.investors.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
