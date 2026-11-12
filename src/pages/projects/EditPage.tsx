import { useParams } from 'react-router'
import { PROJECTS_TABLE, useProjectQuery } from '@/entities/project'
import { ProjectForm } from '@/features/project-editor'
import { useUpdateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function ProjectEditPage() {
  const t = useT()
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
      back={{ to: RECORDS.projects.list, label: t('Projects') }}
    >
      {(p) => (
        <>
          <PageHeader
            back={{ to: RECORDS.projects.detail(p.id), label: p.name }}
            title={t('Edit {name}', { name: p.name })}
          />
          <ProjectForm
            project={p}
            submitLabel={t('Save changes')}
            cancelTo={RECORDS.projects.detail(p.id)}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
