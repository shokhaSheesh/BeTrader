import { PROJECT_INVESTORS_TABLE } from '@/entities/project-investor'
import { ProjectInvestorForm } from '@/features/project-investor-editor'
import { useCreateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function ProjectInvestorCreatePage() {
  const create = useCreateRecord({
    table: PROJECT_INVESTORS_TABLE,
    noun: 'investment',
    routes: RECORDS.projectInvestors,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.projectInvestors.list, label: 'Project investors' }}
        title="Add investment"
      />
      <ProjectInvestorForm
        submitLabel="Add investment"
        cancelTo={RECORDS.projectInvestors.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
