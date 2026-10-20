import { useParams } from 'react-router'
import { POLICY_TYPES_TABLE, usePolicyTypeQuery } from '@/entities/policy-type'
import { useUpdateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = usePolicyTypeQuery(id)
  const update = useUpdateRecord(
    { table: POLICY_TYPES_TABLE, noun: 'policy type', routes: RECORDS.policyTypes },
    id,
  )
  return (
    <RecordBoundary
      query={query}
      noun="policy type"
      back={{ to: RECORDS.policyTypes.list, label: 'Policy types' }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.policyTypes.detail(r.id), label: 'Policy types' }}
            title={`Edit ${r.labelEn ?? 'policy type'}`}
          />
          <RecordForm
            spec={FORM_SPECS.policyTypes}
            defaults={{ label_en: r.labelEn, label_ru: r.labelRu, label_uz: r.labelUz }}

            submitLabel="Save changes"
            cancelTo={RECORDS.policyTypes.detail(r.id)}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
