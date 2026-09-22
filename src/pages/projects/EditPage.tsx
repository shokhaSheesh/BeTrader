import { useParams } from 'react-router'
import { useProjectQuery } from '@/entities/project'
import { ProjectForm } from '@/features/project-editor'
import { notWired } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function ProjectEditPage() {
  const { id } = useParams()
  const query = useProjectQuery(id)

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
            onSubmit={() => notWired('save')}
          />
        </>
      )}
    </RecordBoundary>
  )
}
