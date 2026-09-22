import { InvestorForm } from '@/features/investor-editor'
import { notWired } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function InvestorCreatePage() {
  return (
    <>
      <PageHeader
        back={{ to: RECORDS.investors.list, label: 'Investors' }}
        title="Create investor"
      />
      <InvestorForm
        submitLabel="Create investor"
        cancelTo={RECORDS.investors.list}
        onSubmit={() => notWired('create')}
      />
    </>
  )
}
