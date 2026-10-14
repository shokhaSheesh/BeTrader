import { useParams } from 'react-router'
import { PROJECTS_TABLE, useProjectQuery } from '@/entities/project'
import { ProjectForm } from '@/features/project-editor'
import { useUpdateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function ProjectEditPage() {
  const { id } = useParams()
  const query = useProjectQuery(id)
  const update = useUpdateRecord(
    { table: PROJECTS_TABLE, noun: 'project', routes: RECORDS.projects },
    id,
  )

  return (
    <RecordBoundary
      query={query}
      noun="project"
      back={{ to: RECORDS.projects.list, label: 'Projects' }}
    >
      {(p) => (
        <>
          <PageHeader
            back={{ to: RECORDS.projects.detail(p.id), label: p.name }}
            title={`Edit ${p.name}`}
          />
          <ProjectForm
            project={p}
            submitLabel="Save changes"
            cancelTo={RECORDS.projects.detail(p.id)}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
