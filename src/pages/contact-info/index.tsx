import { formatPhone } from '@/shared/lib/format'
import { CONTACT_INFO_TABLE, useContactInfoItemsQuery } from '@/entities/contact-info'
import { RECORDS } from '@/shared/config/routes'
import { CodeCell, Dash } from '@/shared/ui'
import { SingletonDetail } from '@/widgets/record-detail'

/** Single-record settings page: the table holds one row, so no list, create or delete. */
export default function Page() {
  const query = useContactInfoItemsQuery({ page: 1, pageSize: 1 })
  return (
    <SingletonDetail
      table={CONTACT_INFO_TABLE}
      title="Contact info"
      description="How investors reach support."
      query={query}
      editTo={(r) => RECORDS.contactInfo.edit(r.id)}

      sections={(r, L) => [
        {
          title: 'Contacts',
          items: [
            { label: L('phone'), value: <CodeCell value={r.phone && formatPhone(r.phone)} /> },
            {
              label: L('telegram'),
              value: r.telegram ? (
                <a
                  href={r.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline-offset-4 hover:underline"
                >
                  {r.telegram}
                </a>
              ) : (
                <Dash />
              ),
            },
          ],
        },
      ]}
    />
  )
}
