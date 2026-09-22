import { useParams } from 'react-router'
import { DOCUMENTS_TABLE, useDocumentItemQuery } from '@/entities/document'
import { investorLabel } from '@/shared/lib/format'
import { RECORDS } from '@/shared/config/routes'
import { Dash, FileLink, RecordLink, TextCell } from '@/shared/ui'
import { RecordDetail } from '@/widgets/record-detail'

export default function DetailPage() {
  const { id } = useParams()
  return (
    <RecordDetail
      table={DOCUMENTS_TABLE}
      noun="document"
      query={useDocumentItemQuery(id)}
      back={{ to: RECORDS.documents.list, label: 'Documents' }}
      title={(r) => r.titleEn ?? 'Document'}
      editTo={(r) => RECORDS.documents.edit(r.id)}
      deleteName={(r) => r.titleEn ?? 'This document'}
      sections={(r, L) => [
        {
          title: 'Document',
          items: [
            {
              label: L('investors_id'),
              value: r.investorId ? (
                <RecordLink to={RECORDS.investors.detail(r.investorId)}>
                  {investorLabel(r.investorName, r.investorPhone)}
                </RecordLink>
              ) : (
                <Dash />
              ),
            },
            { label: L('title_en'), value: <TextCell value={r.titleEn} /> },
            { label: L('title_ru'), value: <TextCell value={r.titleRu} /> },
            { label: L('title_uz'), value: <TextCell value={r.titleUz} /> },
          ],
        },
        {
          title: 'Files',
          items: [
            { label: L('file'), value: <FileLink url={r.file} /> },
            { label: L('file_en'), value: <FileLink url={r.fileEn} /> },
            { label: L('file_uz'), value: <FileLink url={r.fileUz} /> },
          ],
        },
      ]}
    />
  )
}
