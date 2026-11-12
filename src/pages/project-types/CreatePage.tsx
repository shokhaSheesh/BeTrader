import { PROJECT_TYPES_TABLE } from '@/entities/project-type'
import { ProjectTypeForm } from '@/features/project-type-editor'
import { useCreateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function ProjectTypeCreatePage() {
  const t = useT()
  const create = useCreateRecord({
    table: PROJECT_TYPES_TABLE,
    noun: 'project type',
    routes: RECORDS.projectTypes,
  })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.projectTypes.list, label: t('Project types') }}
        title={t('Create project type')}
      />
      <ProjectTypeForm
        submitLabel={t('Create project type')}
        cancelTo={RECORDS.projectTypes.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
