import { useParams } from 'react-router'
import { ABOUT_US_TABLE, useAboutUsQuery } from '@/entities/about-us'
import { useUpdateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useAboutUsQuery(id)
  // A settings record: saving returns to the page that shows it
  const update = useUpdateRecord(
    {
      table: ABOUT_US_TABLE,
      noun: 'about us',
      routes: { list: RECORDS.aboutUs.list, detail: () => RECORDS.aboutUs.list },
    },
    id,
  )
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
            defaults={{ text_en: r.textEn, text_ru: r.textRu, text_uz: r.textUz, files: r.files }}
            submitLabel="Save changes"
            cancelTo={RECORDS.aboutUs.list}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
