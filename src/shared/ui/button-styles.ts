import { cn } from '@/shared/lib/cn'

export type ButtonVariant = 'primary' | 'dark' | 'secondary' | 'ghost' | 'danger' | 'danger-ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  dark: 'bg-inverse text-on-inverse hover:bg-inverse-hover',
  secondary: 'bg-surface-muted text-fg hover:bg-line',
  ghost: 'text-fg-muted hover:bg-surface-muted hover:text-fg',
  danger: 'bg-danger-text text-surface hover:opacity-90',
  'danger-ghost': 'text-danger-text hover:bg-danger-tint',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-3 text-sm',
  md: 'h-10 gap-2 px-4 text-sm',
  lg: 'h-11 gap-2 px-5 text-base',
}

/** Also used by links that look like buttons (`ButtonLink`). */
export function buttonClass(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
) {
  return cn(
    'inline-flex shrink-0 items-center justify-center rounded-full font-medium whitespace-nowrap transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-50 aria-busy:opacity-100',
    variants[variant],
    sizes[size],
    className,
  )
}
