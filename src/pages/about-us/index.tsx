import { ABOUT_US_TABLE, useAboutUsItemsQuery } from '@/entities/about-us'
import { RECORDS } from '@/shared/config/routes'
import { FileList, RichText } from '@/shared/ui'
import { SingletonDetail } from '@/widgets/record-detail'
import { useT } from '@/shared/i18n'

/** Single-record settings page: the table holds one row, so no list, create or delete. */
export default function Page() {
  const t = useT()
  const query = useAboutUsItemsQuery({ page: 1, pageSize: 1 })
  return (
    <SingletonDetail
      table={ABOUT_US_TABLE}
      title={t('About us')}
      description={t('The About us text and license documents shown in the app.')}
      query={query}
      editTo={(r) => RECORDS.aboutUs.edit(r.id)}

      sections={(r, L) => [
        {
          title: t('Text'),
          items: [
            { label: L('text_en'), value: <RichText value={r.textEn} /> },
            { label: L('text_ru'), value: <RichText value={r.textRu} /> },
            { label: L('text_uz'), value: <RichText value={r.textUz} /> },
          ],
        },
        { title: t('Files'), items: [{ label: L('files'), value: <FileList urls={r.files} /> }] },
      ]}
    />
  )
}
