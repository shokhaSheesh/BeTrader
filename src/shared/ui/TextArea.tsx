import { forwardRef, useId, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'
import { Field } from './Field'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
}

/** Multi-line text (MULTI_LINE fields). Same look as TextField; grows vertically only. */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, error, hint, className, id, rows = 4, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <Field label={label} htmlFor={inputId} error={error} hint={hint}>
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={!!error || undefined}
        className={cn(
          'w-full resize-y rounded-sm border border-transparent bg-surface-muted px-3 py-2.5 outline-none placeholder:text-fg-subtle focus:border-focus aria-invalid:border-danger',
          className,
        )}
        {...props}
      />
    </Field>
  )
})
