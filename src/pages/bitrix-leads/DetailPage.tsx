import { useParams } from 'react-router'
import { BITRIX_LEADS_TABLE, useBitrixLeadQuery } from '@/entities/bitrix-lead'
import { RECORDS } from '@/shared/config/routes'
import { toneFor } from '@/shared/lib/tones'
import { Badge, CodeCell, Dash, RecordLink, TextCell, YesNoCell } from '@/shared/ui'
import { RecordDetail } from '@/widgets/record-detail'

/** Pretty-prints JSON bodies; anything else is shown as sent. */
function Body({ value }: { value: string | null }) {
  if (!value) return <Dash />
  let text = value
  try {
    text = JSON.stringify(JSON.parse(value), null, 2)
  } catch {
    // not JSON: show as is
  }
  return (
    <pre className="num max-h-80 overflow-auto rounded-sm bg-surface-muted p-3 text-xs whitespace-pre-wrap">
      {text}
    </pre>
  )
}

/** Read-only: a log entry of the Bitrix CRM integration. */
export default function DetailPage() {
  const { id } = useParams()
  return (
    <RecordDetail
      table={BITRIX_LEADS_TABLE}
      noun="Bitrix lead"
      query={useBitrixLeadQuery(id)}
      back={{ to: RECORDS.bitrixLeads.list, label: 'Bitrix leads' }}
      title={(r) => r.investorName ?? 'Bitrix lead'}
      description={(r) =>
        r.status ? <Badge tone={toneFor('status', r.status)}>{r.status}</Badge> : undefined
      }
      sections={(r, L) => [
        {
          title: 'Sync',
          items: [
            {
              label: L('investors_id'),
              value: r.investorsId ? (
                <RecordLink to={RECORDS.investors.detail(r.investorsId)}>
                  {r.investorName ?? 'Open investor'}
                </RecordLink>
              ) : (
                <Dash />
              ),
            },
            { label: L('phone'), value: <CodeCell value={r.phone} /> },
            { label: L('status'), value: <TextCell value={r.status} /> },
            { label: L('lead_type'), value: <TextCell value={r.leadType} /> },
            { label: L('bitrix_method'), value: <CodeCell value={r.bitrixMethod} /> },
            { label: L('http_status'), value: <CodeCell value={r.httpStatus} /> },
            { label: L('bitrix_lead_id'), value: <CodeCell value={r.bitrixLeadId} /> },
            { label: L('deposit_synced'), value: <YesNoCell value={r.depositSynced} /> },
          ],
        },
        { title: L('error'), items: [{ label: L('error'), value: <Body value={r.error} /> }] },
        {
          title: 'Request and response',
          items: [
            { label: L('request_body'), value: <Body value={r.requestBody} /> },
            { label: L('response_body'), value: <Body value={r.responseBody} /> },
          ],
        },
      ]}
    />
  )
}
