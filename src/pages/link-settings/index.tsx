import { LINK_SETTINGS_TABLE, useLinkSettingsQuery } from '@/entities/link-setting'
import { RECORDS } from '@/shared/config/routes'
import { Dash, PercentCell } from '@/shared/ui'
import { SingletonDetail } from '@/widgets/record-detail'
import { useT } from '@/shared/i18n'

/** Single-record settings page: the referral program's configuration. */
export default function Page() {
  const t = useT()
  return (
    <SingletonDetail
      table={LINK_SETTINGS_TABLE}
      title={t('Link settings')}
      description={t('How referral links are built and what the sender earns.')}
      query={useLinkSettingsQuery({ page: 1, pageSize: 1 })}
      editTo={(r) => RECORDS.linkSettings.edit(r.id)}
      sections={(r, L) => [
        {
          title: t('Referral program'),

          items: [
            { label: L('sender_percentage'), value: <PercentCell value={r.senderPercentage} /> },
            {
              label: L('base_url'),
              value: r.baseUrl ? <span className="num break-all">{r.baseUrl}</span> : <Dash />,
            },
          ],
        },
      ]}
    />
  )
}
