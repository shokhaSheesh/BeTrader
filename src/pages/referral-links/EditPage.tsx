import { useParams } from 'react-router'
import { useReferralLinkQuery } from '@/entities/referral-link'
import { notWired } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useReferralLinkQuery(id)
  return (
    <RecordBoundary
      query={query}
      noun="referral link"
      back={{ to: RECORDS.referralLinks.list, label: 'Referral links' }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.referralLinks.detail(r.id), label: 'Referral link' }}
            title="Edit referral link"
          />
          <RecordForm
            spec={FORM_SPECS.referralLinks}
            defaults={{ is_active: r.isActive ?? false }}
            submitLabel="Save changes"
            cancelTo={RECORDS.referralLinks.detail(r.id)}
            onSubmit={() => notWired('save')}
          />
        </>
      )}
    </RecordBoundary>
  )
}
