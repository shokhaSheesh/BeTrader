import { useParams } from 'react-router'
import { SMS_TEMPLATES_TABLE, useSmsTemplateQuery } from '@/entities/sms-template'
import { RECORDS } from '@/shared/config/routes'
import { TextCell } from '@/shared/ui'
import { RecordDetail } from '@/widgets/record-detail'
import { useLocalized, useT } from '@/shared/i18n'

export default function DetailPage() {
  const { id } = useParams()
  const t = useT()
  const pick = useLocalized()
  return (
    <RecordDetail
      table={SMS_TEMPLATES_TABLE}
      noun="template"
      query={useSmsTemplateQuery(id)}
      back={{ to: RECORDS.smsTemplates.list, label: t('SMS templates') }}
      title={(r) => pick(r.en, r.ru) ?? t('SMS template')}
      editTo={(r) => RECORDS.smsTemplates.edit(r.id)}
      wired
      deleteName={(r) => pick(r.en, r.ru) ?? t('This template')}
      sections={(r, L) => [
        {
          title: t('Texts'),

          items: [
            { label: L('en'), value: <TextCell value={r.en} /> },
            { label: L('ru'), value: <TextCell value={r.ru} /> },
            { label: L('uz'), value: <TextCell value={r.uz} /> },
            { label: L('text'), value: <TextCell value={r.text} /> },
          ],
        },
      ]}
    />
  )
}
