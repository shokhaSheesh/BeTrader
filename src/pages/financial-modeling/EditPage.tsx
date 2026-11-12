import { useParams } from 'react-router'
import { FINANCIAL_MODELING_TABLE, useFinancialModelQuery } from '@/entities/financial-model'
import { useUpdateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { numberToText } from '@/shared/lib/form'
import { formatDate } from '@/shared/lib/format'
import { PageHeader, RecordBoundary } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function EditPage() {
  const t = useT()
  const { id } = useParams()
  const query = useFinancialModelQuery(id)
  const update = useUpdateRecord(
    { table: FINANCIAL_MODELING_TABLE, noun: 'price', routes: RECORDS.financialModeling },
    id,
  )
  return (
    <RecordBoundary
      query={query}
      noun="price"
      back={{ to: RECORDS.financialModeling.list, label: t('Financial modeling') }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.financialModeling.detail(r.id), label: t('Financial modeling') }}
            title={
              r.date
                ? t('Edit {name} for {date}', {
                    name: r.projectKeyName ?? t('price'),
                    date: formatDate(r.date),
                  })
                : t('Edit price')
            }
          />
          <RecordForm
            spec={FORM_SPECS.financialModeling}
            defaults={{
              project_key_name: r.projectKeyName,
              date: r.date,
              price: numberToText(r.price),
            }}

            submitLabel={t('Save changes')}
            cancelTo={RECORDS.financialModeling.detail(r.id)}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
