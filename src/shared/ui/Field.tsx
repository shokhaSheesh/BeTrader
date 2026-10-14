import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  htmlFor?: string
  error?: string
  hint?: string
  /** The backend requires this field (`required` in /v2/fields): marked next to the label */
  required?: boolean
  children: ReactNode
}

/** Label above, control, then error or hint below: the only form-field layout (DESIGN.md §3). */
export function Field({ label, htmlFor, error, hint, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="font-medium">
        {label}
        {required && (
          <span className="ml-0.5 text-danger-text" aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} className="text-xs text-danger-text">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-fg-muted">{hint}</p>
      )}
    </div>
  )
}
