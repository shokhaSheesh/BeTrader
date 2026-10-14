import { PROJECTS_TABLE } from '@/entities/project'
import { ProjectForm } from '@/features/project-editor'
import { useCreateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function ProjectCreatePage() {
  const create = useCreateRecord({
    table: PROJECTS_TABLE,
    noun: 'project',
    routes: RECORDS.projects,
  })

  return (
    <>
      <PageHeader back={{ to: RECORDS.projects.list, label: 'Projects' }} title="Create project" />
      <ProjectForm
        submitLabel="Create project"
        cancelTo={RECORDS.projects.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
