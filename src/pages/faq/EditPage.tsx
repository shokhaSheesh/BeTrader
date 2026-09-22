import { useParams } from 'react-router'
import { useFaqItemQuery } from '@/entities/faq'
import { notWired } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useFaqItemQuery(id)
  return (
    <RecordBoundary query={query} noun="question" back={{ to: RECORDS.faq.list, label: 'FAQ' }}>
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.faq.detail(r.id), label: 'FAQ' }}
            title={'Edit question'}
          />
          <RecordForm
            spec={FORM_SPECS.faq}
            defaults={{
              question_en: r.questionEn,
              question_ru: r.questionRu,
              question_uz: r.questionUz,
              answer_en: r.answerEn,
              answer_ru: r.answerRu,
              answer_uz: r.answerUz,
            }}

            submitLabel="Save changes"
            cancelTo={RECORDS.faq.detail(r.id)}
            onSubmit={() => notWired('save')}
          />
        </>
      )}
    </RecordBoundary>
  )
}
