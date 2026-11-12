import { STR_SAR_TABLE } from '@/entities/str-report'
import { useCreateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function CreatePage() {
  const t = useT()
  const create = useCreateRecord({ table: STR_SAR_TABLE, noun: 'report', routes: RECORDS.strSar })

  return (
    <>
      <PageHeader back={{ to: RECORDS.strSar.list, label: 'STR/SAR' }} title={t('File report')} />
      <RecordForm
        spec={FORM_SPECS.strSar}
        submitLabel={t('File report')}

        cancelTo={RECORDS.strSar.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
