import { useParams } from 'react-router'
import { LINK_SETTINGS_TABLE, useLinkSettingQuery } from '@/entities/link-setting'
import { useUpdateRecord } from '@/features/record-actions'
import { FORM_SPECS, RecordForm } from '@/features/record-form'
import { RECORDS } from '@/shared/config/routes'
import { numberToText } from '@/shared/lib/form'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useLinkSettingQuery(id)
  // A settings record: saving returns to the page that shows it
  const update = useUpdateRecord(
    {
      table: LINK_SETTINGS_TABLE,
      noun: 'link settings',
      routes: { list: RECORDS.linkSettings.list, detail: () => RECORDS.linkSettings.list },
    },
    id,
  )
  return (
    <RecordBoundary
      query={query}
      noun="link settings"
      back={{ to: RECORDS.linkSettings.list, label: 'Link settings' }}
    >
      {(r) => (
        <>
          <PageHeader
            back={{ to: RECORDS.linkSettings.list, label: 'Link settings' }}
            title="Edit link settings"
          />
          <RecordForm
            spec={FORM_SPECS.linkSettings}
            defaults={{ sender_percentage: numberToText(r.senderPercentage), base_url: r.baseUrl }}
            submitLabel="Save changes"
            cancelTo={RECORDS.linkSettings.list}
            submitting={update.submitting}
            onSubmit={update.submit}
          />
        </>
      )}
    </RecordBoundary>
  )
}
