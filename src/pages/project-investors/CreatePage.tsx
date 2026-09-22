import { ProjectInvestorForm } from '@/features/project-investor-editor'
import { notWired } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function ProjectInvestorCreatePage() {
  return (
    <>
      <PageHeader
        back={{ to: RECORDS.projectInvestors.list, label: 'Project investors' }}
        title="Add investment"
      />
      <ProjectInvestorForm
        submitLabel="Add investment"
        cancelTo={RECORDS.projectInvestors.list}
        onSubmit={() => notWired('create')}
      />
    </>
  )
}
