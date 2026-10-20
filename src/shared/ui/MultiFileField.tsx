import { useRef, useState } from 'react'
import { FileUp, X } from 'lucide-react'
import { Button } from './Button'
import { FileLink } from './cells'

interface MultiFileFieldProps {
  id?: string
  /** The files' URLs, in order, as the record stores them (MULTI_FILE) */
  value: string[]
  onChange: (urls: string[]) => void
  /** Stores one file and resolves to its URL; the caller owns the API */
  upload: (file: File) => Promise<string>
  /** Called when an upload fails, so the page can say why */
  onError?: (error: unknown) => void
  accept?: string
}

/**
 * A list of files: open any, remove any, add more (several at once). The native file input stays
 * hidden (DESIGN.md §3); "Add files" shows a loader while uploading (§1). Removing a file only
 * takes it off this record; the stored file itself isn't deleted.
 */
export function MultiFileField({
  id,
  value,
  onChange,
  upload,
  onError,
  accept,
}: MultiFileFieldProps) {
  const input = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const add = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(true)
    const added: string[] = []
    try {
      // One at a time, in the order picked, so the list keeps that order
      for (const file of [...files]) added.push(await upload(file))
    } catch (error) {
      onError?.(error)
    } finally {
      if (added.length) onChange([...value, ...added])
      setUploading(false)
      if (input.current) input.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {value.length === 0 ? (
        <span className="text-fg-muted">No files</span>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {value.map((url, i) => (
            <li key={url} className="flex items-center gap-2">
              <FileLink url={url} />
              <button
                type="button"
                aria-label="Remove file"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="grid size-7 shrink-0 place-items-center rounded-full text-fg-muted hover:bg-surface-muted hover:text-danger-text"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div>
        <Button
          type="button"
          variant="secondary"
          icon={FileUp}
          loading={uploading}
          onClick={() => input.current?.click()}
        >
          Add files
        </Button>
      </div>
      <input
        ref={input}
        id={id}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={(e) => add(e.target.files)}
      />
    </div>
  )
}
