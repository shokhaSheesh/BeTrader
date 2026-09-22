import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

/** Label above, error below (DESIGN.md §3). */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, className, id, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const errorId = `${inputId}-error`

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="font-medium">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'h-11 rounded-sm border border-transparent bg-surface-muted px-3 outline-none placeholder:text-fg-subtle focus:border-focus',
          'aria-invalid:border-danger',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-xs text-danger-text">
          {error}
        </p>
      )}
    </div>
  )
})
