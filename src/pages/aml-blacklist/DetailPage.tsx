import { useParams } from 'react-router'
import { BLACKLIST_TABLE, useBlacklistEntryQuery } from '@/entities/blacklist-entry'
import { RECORDS } from '@/shared/config/routes'
import { CodeCell, TextCell } from '@/shared/ui'
import { RecordDetail } from '@/widgets/record-detail'

export default function DetailPage() {
  const { id } = useParams()
  return (
    <RecordDetail
      table={BLACKLIST_TABLE}
      noun="entry"
      query={useBlacklistEntryQuery(id)}
      back={{ to: RECORDS.amlBlacklist.list, label: 'AML blacklist' }}
      title={(r) => r.name ?? r.passport ?? 'Blacklist entry'}
      editTo={(r) => RECORDS.amlBlacklist.edit(r.id)}
      deleteName={(r) => r.name ?? r.passport ?? 'This entry'}
      sections={(r, L) => [
        {
          title: 'Person',
          items: [
            { label: L('name'), value: <TextCell value={r.name} /> },
            { label: L('surname'), value: <TextCell value={r.surname} /> },
            { label: L('passport'), value: <CodeCell value={r.passport} /> },
            { label: L('pin'), value: <CodeCell value={r.pin} /> },
          ],
        },
      ]}
    />
  )
}
