import { PROJECT_INVESTORS_TABLE } from '@/entities/project-investor'
import { ProjectInvestorForm } from '@/features/project-investor-editor'
import { useCreateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function ProjectInvestorCreatePage() {
  const t = useT()
  const create = useCreateRecord({
    table: PROJECT_INVESTORS_TABLE,
    noun: 'investment',
    routes: RECORDS.projectInvestors,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.projectInvestors.list, label: t('Project investors') }}
        title={t('Add investment')}
      />
      <ProjectInvestorForm
        submitLabel={t('Add investment')}
        cancelTo={RECORDS.projectInvestors.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
