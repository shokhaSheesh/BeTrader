import { useParams } from 'react-router'
import { REFERRAL_LINKS_TABLE, useReferralLinkQuery } from '@/entities/referral-link'
import { useUpdateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function EditPage() {
  const { id } = useParams()
  const t = useT()
  const query = useReferralLinkQuery(id)
  const update = useUpdateRecord(
    { table: REFERRAL_LINKS_TABLE, noun: 'referral link', routes: RECORDS.referralLinks },
    id,
  )
  return (
    <RecordBoundary
      query={query}
      noun="referral link"
      back={{ to: RECORDS.referralLinks.list, label: t('Referral links') }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.referralLinks.detail(r.id), label: t('Referral link') }}
            title={t('Edit referral link')}
          />
          <RecordForm
            spec={FORM_SPECS.referralLinks}
            defaults={{ is_active: r.isActive ?? false }}
            submitLabel={t('Save changes')}

            cancelTo={RECORDS.referralLinks.detail(r.id)}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
