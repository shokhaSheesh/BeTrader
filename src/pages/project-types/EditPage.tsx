import { useParams } from 'react-router'
import { PROJECT_TYPES_TABLE, useProjectTypeQuery } from '@/entities/project-type'
import { ProjectTypeForm } from '@/features/project-type-editor'
import { useUpdateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function ProjectTypeEditPage() {
  const { id } = useParams()
  const query = useProjectTypeQuery(id)
  const update = useUpdateRecord(
    { table: PROJECT_TYPES_TABLE, noun: 'project type', routes: RECORDS.projectTypes },
    id,
  )

  return (
    <RecordBoundary
      query={query}
      noun="project type"
      back={{ to: RECORDS.projectTypes.list, label: 'Project types' }}
    >
      {(t) => (
        <>
          <PageHeader
            back={{ to: RECORDS.projectTypes.detail(t.id), label: t.name }}
            title={`Edit ${t.name}`}
          />
          <ProjectTypeForm
            projectType={t}
            submitLabel="Save changes"
            cancelTo={RECORDS.projectTypes.detail(t.id)}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
