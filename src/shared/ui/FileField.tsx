import { useRef, useState } from 'react'
import { FileUp, Trash2 } from 'lucide-react'
import { Button } from './Button'
import { FileLink } from './cells'

interface FileFieldProps {
  id?: string
  /** The file's URL, as the record stores it */
  value: string | null
  onChange: (url: string | null) => void
  /** Stores the file and resolves to its URL; the caller owns the API */
  upload: (file: File) => Promise<string>
  /** Called when the upload fails, so the page can say why */
  onError?: (error: unknown) => void
  /** Limits the file picker, e.g. ".pdf" */
  accept?: string
}

/**
 * Pick, open, replace or remove one file. The native file input stays hidden (DESIGN.md §3);
 * the button shows a loader while the file uploads (§1).
 */
export function FileField({ id, value, onChange, upload, onError, accept }: FileFieldProps) {
  const input = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const pick = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    try {
      onChange(await upload(file))
    } catch (error) {
      onError?.(error)
    } finally {
      setUploading(false)
      // Picking the same file again must still fire a change
      if (input.current) input.current.value = ''
    }
  }

  return (
    <div className="flex min-h-10 flex-wrap items-center gap-3">
      {value ? <FileLink url={value} /> : <span className="text-fg-muted">No file</span>}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          icon={FileUp}
          loading={uploading}
          onClick={() => input.current?.click()}
        >
          {value ? 'Replace file' : 'Upload file'}
        </Button>
        {value && !uploading && (
          <Button type="button" variant="danger-ghost" icon={Trash2} onClick={() => onChange(null)}>
            Remove
          </Button>
        )}
      </div>
      <input
        ref={input}
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />
    </div>
  )
}
