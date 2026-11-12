import { useParams } from 'react-router'
import { REFERRAL_LINKS_TABLE, useReferralLinkQuery } from '@/entities/referral-link'
import { RECORDS } from '@/shared/config/routes'
import { formatPhone } from '@/shared/lib/format'
import { Badge, CodeCell, Dash, DateTimeCell, RecordLink } from '@/shared/ui'
import { RecordDetail } from '@/widgets/record-detail'
import { useT } from '@/shared/i18n'

export default function DetailPage() {
  const { id } = useParams()
  const t = useT()
  const investor = (id: string | null, name: string | null) =>
    id ? (
      <RecordLink to={RECORDS.investors.detail(id)}>{name ?? t('Open investor')}</RecordLink>
    ) : (
      <Dash />
    )
  const tx = (id: string | null) =>
    id ? (
      <RecordLink to={RECORDS.transactions.detail(id)}>{t('Open transaction')}</RecordLink>
    ) : (
      <Dash />
    )
  return (
    <RecordDetail
      table={REFERRAL_LINKS_TABLE}
      noun="referral link"
      query={useReferralLinkQuery(id)}
      back={{ to: RECORDS.referralLinks.list, label: t('Referral links') }}
      title={(r) => (r.senderName ? t('Invite from {name}', { name: r.senderName }) : t('Invite'))}
      description={(r) =>
        r.isActive ? <Badge tone="success">{t('Active')}</Badge> : <Badge>{t('Inactive')}</Badge>
      }
      editTo={(r) => RECORDS.referralLinks.edit(r.id)}
      wired
      deleteName={(r) =>
        r.senderName
          ? t('The link shared by {name}', { name: r.senderName })
          : t('The link shared by this investor')
      }
      sections={(r, L) => [
        {
          title: t('Shared by'),
          items: [
            { label: L('investors_id'), value: investor(r.investorsId, r.senderName) },
            {
              label: L('send_phone_number'),
              value: <CodeCell value={r.sendPhoneNumber && formatPhone(r.sendPhoneNumber)} />,
            },
            { label: L('send_investor_u_id'), value: <CodeCell value={r.sendInvestorUId} /> },
            { label: L('send_at'), value: <DateTimeCell value={r.sendAt} /> },
          ],
        },
        {
          title: t('Joined'),
          items: [
            { label: L('investors_id_2'), value: investor(r.investorsId2, r.enteredName) },
            {
              label: L('entered_phone_number'),
              value: <CodeCell value={r.enteredPhoneNumber && formatPhone(r.enteredPhoneNumber)} />,
            },
            { label: L('register_date'), value: <DateTimeCell value={r.registerDate} /> },
          ],
        },
        {
          title: t('Rewards'),

          items: [
            { label: L('transactions_id'), value: tx(r.transactionsId) },
            { label: L('transactions_id_2'), value: tx(r.transactionsId2) },
          ],
        },
      ]}
    />
  )
}
