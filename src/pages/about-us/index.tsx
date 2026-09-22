import { ABOUT_US_TABLE, useAboutUsItemsQuery } from '@/entities/about-us'
import { RECORDS } from '@/shared/config/routes'
import { FileList, TextCell } from '@/shared/ui'
import { SingletonDetail } from '@/widgets/record-detail'

/** Single-record settings page: the table holds one row, so no list, create or delete. */
export default function Page() {
  const query = useAboutUsItemsQuery({ page: 1, pageSize: 1 })
  return (
    <SingletonDetail
      table={ABOUT_US_TABLE}
      title="About us"
      description="The About us text and license documents shown in the app."
      query={query}
      editTo={(r) => RECORDS.aboutUs.edit(r.id)}

      sections={(r, L) => [
        {
          title: 'Text',
          items: [
            { label: L('text_en'), value: <TextCell value={r.textEn} /> },
            { label: L('text_ru'), value: <TextCell value={r.textRu} /> },
            { label: L('text_uz'), value: <TextCell value={r.textUz} /> },
          ],
        },
        { title: 'Files', items: [{ label: L('files'), value: <FileList urls={r.files} /> }] },
      ]}
    />
  )
}
