import { useParams } from 'react-router'
import { PROJECT_TYPES_TABLE, useProjectTypeQuery } from '@/entities/project-type'
import { ProjectTypeForm } from '@/features/project-type-editor'
import { useUpdateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function ProjectTypeEditPage() {
  const t = useT()
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
      back={{ to: RECORDS.projectTypes.list, label: t('Project types') }}
    >
      {(pt) => (
        <>
          <PageHeader
            back={{ to: RECORDS.projectTypes.detail(pt.id), label: pt.name }}
            title={t('Edit {name}', { name: pt.name })}
          />
          <ProjectTypeForm
            projectType={pt}
            submitLabel={t('Save changes')}
            cancelTo={RECORDS.projectTypes.detail(pt.id)}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
