import { useState, type ReactNode } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import { Pencil, Trash2 } from 'lucide-react'
import { DeleteRecordDialog } from '@/features/record-actions'
import { useTableFields } from '@/shared/api/useTableFields'
import {
  Button,
  ButtonLink,
  CodeCell,
  DateTimeCell,
  DetailSection,
  PageHeader,
  RecordBoundary,
  type DetailItem,
} from '@/shared/ui'

interface BaseRecord {
  id: string
  createdAt: string
  updatedAt: string
}

interface RecordDetailProps<T extends BaseRecord> {
  /** Backend table slug: field labels come from its schema */
  table: string
  /** Singular, lowercase: "policy type" */
  noun: string
  query: UseQueryResult<T>
  back: { to: string; label: string }
  title: (r: T) => ReactNode
  description?: (r: T) => ReactNode
  /** Omit for read-only records */
  editTo?: (r: T) => string
  /** Name used in the delete confirmation; omit to hide Delete */
  deleteName?: (r: T) => string
  sections: (r: T, label: (slug: string) => string) => { title: string; items: DetailItem[] }[]
}

/** Detail page for simple records: header with Edit/Delete, field sections, then a "Record" section. */
export function RecordDetail<T extends BaseRecord>({
  table,
  noun,
  query,
  back,
  title,
  description,
  editTo,
  deleteName,
  sections,
}: RecordDetailProps<T>) {
  const fields = useTableFields(table)
  const [deleting, setDeleting] = useState(false)

  return (
    <RecordBoundary query={query} noun={noun} back={back} alsoPending={fields.isPending}>
      {(r) => (
        <>
          <PageHeader
            back={back}
            title={title(r)}
            description={description?.(r)}
            actions={
              (editTo || deleteName) && (
                <>
                  {deleteName && (
                    <Button variant="danger-ghost" icon={Trash2} onClick={() => setDeleting(true)}>
                      Delete
                    </Button>
                  )}
                  {editTo && (
                    <ButtonLink to={editTo(r)} icon={Pencil}>
                      Edit {noun}
                    </ButtonLink>
                  )}
                </>
              )
            }
          />
          <div className="flex flex-col gap-6">
            {sections(r, fields.fieldLabel).map((s) => (
              <DetailSection key={s.title} title={s.title} items={s.items} />
            ))}
            <DetailSection
              title="Record"
              items={[
                { label: 'Created', value: <DateTimeCell value={r.createdAt} /> },
                { label: 'Last updated', value: <DateTimeCell value={r.updatedAt} /> },
                { label: fields.fieldLabel('guid'), value: <CodeCell value={r.id} /> },
              ]}
            />
          </div>
          {deleteName && (
            <DeleteRecordDialog
              noun={noun}
              target={deleting ? { name: deleteName(r) } : null}
              onClose={() => setDeleting(false)}
            />
          )}
        </>
      )}
    </RecordBoundary>
  )
}
