import { useParams } from 'react-router'
import { useAboutUsQuery } from '@/entities/about-us'
import { notWired } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useAboutUsQuery(id)
  return (
    <RecordBoundary
      query={query}
      noun="about us"
      back={{ to: RECORDS.aboutUs.list, label: 'About us' }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.aboutUs.list, label: 'About us' }}
            title="Edit about us"
          />
          <RecordForm
            spec={FORM_SPECS.aboutUs}
            defaults={{ text_en: r.textEn, text_ru: r.textRu, text_uz: r.textUz }}
            submitLabel="Save changes"
            cancelTo={RECORDS.aboutUs.list}
            onSubmit={() => notWired('save')}
          />
        </>
      )}
    </RecordBoundary>
  )
}
