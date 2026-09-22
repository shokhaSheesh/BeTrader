import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'
import { Field } from './Field'
import { controlBase, controlSizes } from './styles'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  /** Numeric input without the browser's spinner arrows: text + decimal keyboard + tabular digits. */
  numeric?: boolean
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, numeric, className, id, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <Field label={label} htmlFor={inputId} error={error} hint={hint}>
      <input
        ref={ref}
        id={inputId}
        type={numeric ? 'text' : props.type}
        inputMode={numeric ? 'decimal' : props.inputMode}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(controlBase, controlSizes.md, numeric && 'num', className)}
        {...props}
      />
    </Field>
  )
})
