import { useParams } from 'react-router'
import { FAQ_TABLE, useFaqItemQuery } from '@/entities/faq'
import { RECORDS } from '@/shared/config/routes'
import { RichText, TextCell } from '@/shared/ui'
import { RecordDetail } from '@/widgets/record-detail'
import { useLocalized, useT } from '@/shared/i18n'

export default function DetailPage() {
  const { id } = useParams()
  const t = useT()
  const pick = useLocalized()
  return (
    <RecordDetail
      table={FAQ_TABLE}
      noun="question"
      query={useFaqItemQuery(id)}
      back={{ to: RECORDS.faq.list, label: 'FAQ' }}
      title={(r) => pick(r.questionEn, r.questionRu) ?? t('Question')}
      editTo={(r) => RECORDS.faq.edit(r.id)}
      wired
      deleteName={(r) => pick(r.questionEn, r.questionRu) ?? t('This question')}
      sections={(r, L) => [
        {
          title: t('English'),
          items: [
            { label: L('question_en'), value: <TextCell value={r.questionEn} /> },
            { label: L('answer_en'), value: <RichText value={r.answerEn} /> },
          ],
        },
        {
          title: t('Russian'),
          items: [
            { label: L('question_ru'), value: <TextCell value={r.questionRu} /> },
            { label: L('answer_ru'), value: <RichText value={r.answerRu} /> },
          ],
        },
        {
          title: t('Uzbek'),

          items: [
            { label: L('question_uz'), value: <TextCell value={r.questionUz} /> },
            { label: L('answer_uz'), value: <RichText value={r.answerUz} /> },
          ],
        },
      ]}
    />
  )
}
