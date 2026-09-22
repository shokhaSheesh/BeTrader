import { useParams } from 'react-router'
import { useFinancialModelQuery } from '@/entities/financial-model'
import { notWired } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { numberToText } from '@/shared/lib/form'
import { formatDate } from '@/shared/lib/format'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useFinancialModelQuery(id)
  return (
    <RecordBoundary
      query={query}
      noun="price"
      back={{ to: RECORDS.financialModeling.list, label: 'Financial modeling' }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.financialModeling.detail(r.id), label: 'Financial modeling' }}
            title={
              r.date
                ? `Edit ${r.projectKeyName ?? 'price'} for ${formatDate(r.date)}`
                : 'Edit price'
            }
          />
          <RecordForm
            spec={FORM_SPECS.financialModeling}
            defaults={{
              project_key_name: r.projectKeyName,
              date: r.date,
              price: numberToText(r.price),
            }}

            submitLabel="Save changes"
            cancelTo={RECORDS.financialModeling.detail(r.id)}
            onSubmit={() => notWired('save')}
          />
        </>
      )}
    </RecordBoundary>
  )
}
