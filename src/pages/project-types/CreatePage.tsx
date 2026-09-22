import { ProjectTypeForm } from '@/features/project-type-editor'
import { notWired } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function ProjectTypeCreatePage() {
  return (
    <>
      <PageHeader
        back={{ to: RECORDS.projectTypes.list, label: 'Project types' }}
        title="Create project type"
      />
      <ProjectTypeForm
        submitLabel="Create project type"
        cancelTo={RECORDS.projectTypes.list}
        onSubmit={() => notWired('create')}
      />
    </>
  )
}
