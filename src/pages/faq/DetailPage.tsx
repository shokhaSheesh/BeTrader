import { useParams } from 'react-router'
import { FAQ_TABLE, useFaqItemQuery } from '@/entities/faq'
import { RECORDS } from '@/shared/config/routes'
import { TextCell } from '@/shared/ui'
import { RecordDetail } from '@/widgets/record-detail'

export default function DetailPage() {
  const { id } = useParams()
  return (
    <RecordDetail
      table={FAQ_TABLE}
      noun="question"
      query={useFaqItemQuery(id)}
      back={{ to: RECORDS.faq.list, label: 'FAQ' }}
      title={(r) => r.questionEn ?? 'Question'}
      editTo={(r) => RECORDS.faq.edit(r.id)}
      deleteName={(r) => r.questionEn ?? 'This question'}
      sections={(r, L) => [
        {
          title: 'English',
          items: [
            { label: L('question_en'), value: <TextCell value={r.questionEn} /> },
            { label: L('answer_en'), value: <TextCell value={r.answerEn} /> },
          ],
        },
        {
          title: 'Russian',
          items: [
            { label: L('question_ru'), value: <TextCell value={r.questionRu} /> },
            { label: L('answer_ru'), value: <TextCell value={r.answerRu} /> },
          ],
        },
        {
          title: 'Uzbek',
          items: [
            { label: L('question_uz'), value: <TextCell value={r.questionUz} /> },
            { label: L('answer_uz'), value: <TextCell value={r.answerUz} /> },
          ],
        },
      ]}
    />
  )
}
