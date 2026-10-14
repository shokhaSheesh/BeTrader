import { useRef, useState } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'
import { Button } from './Button'
import { Spinner } from './Spinner'

interface ImageFieldProps {
  id?: string
  /** The image's URL, as the record stores it */
  value: string | null
  onChange: (url: string | null) => void
  /** Stores the file and resolves to its URL; the caller owns the API */
  upload: (file: File) => Promise<string>
  /** Called when the upload fails, so the page can say why */
  onError?: (error: unknown) => void
}

/**
 * Pick, preview, replace or remove one image. The native file input stays hidden
 * (DESIGN.md §3); the preview shows a loader while the file uploads (§1).
 */
export function ImageField({ id, value, onChange, upload, onError }: ImageFieldProps) {
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
    <div className="flex items-center gap-4">
      <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-line bg-surface-muted">
        {value ? (
          <img src={value} alt="" className="size-full object-cover" />
        ) : (
          <ImagePlus size={24} className="text-fg-subtle" />
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/80">
            <Spinner />
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          icon={ImagePlus}
          loading={uploading}
          onClick={() => input.current?.click()}
        >
          {value ? 'Replace image' : 'Upload image'}
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
        accept="image/*"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />
    </div>
  )
}
