import { ProjectForm } from '@/features/project-editor'
import { notWired } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function ProjectCreatePage() {
  return (
    <>
      <PageHeader back={{ to: RECORDS.projects.list, label: 'Projects' }} title="Create project" />
      <ProjectForm
        submitLabel="Create project"
        cancelTo={RECORDS.projects.list}
        onSubmit={() => notWired('create')}
      />
    </>
  )
}
