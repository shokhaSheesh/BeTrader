import type { ButtonHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { useMinimumLoading } from '@/shared/hooks/useMinimumLoading'
import { cn } from '@/shared/lib/cn'
import { Spinner } from './Spinner'

type Variant = 'primary' | 'dark' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  dark: 'bg-inverse text-on-inverse hover:bg-inverse-hover',
  secondary: 'bg-surface-muted text-fg hover:bg-line',
  ghost: 'text-fg-muted hover:bg-surface-muted hover:text-fg',
  danger: 'bg-danger-text text-surface hover:opacity-90',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 gap-1.5 px-3 text-sm',
  md: 'h-10 gap-2 px-4 text-sm',
  lg: 'h-11 gap-2 px-5 text-base',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: LucideIcon
  /** Shows a spinner in place of the icon, disables the button, keeps its width. */
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const showSpinner = useMinimumLoading(loading)
  const iconSize = size === 'sm' ? 14 : 16

  return (
    <button
      type={type}
      disabled={disabled || showSpinner}
      aria-busy={showSpinner || undefined}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-medium whitespace-nowrap transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50 aria-busy:opacity-100',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {showSpinner ? <Spinner size={iconSize} /> : Icon && <Icon size={iconSize} strokeWidth={2} />}
      {children}
    </button>
  )
}
