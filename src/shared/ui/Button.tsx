import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router'
import type { LucideIcon } from 'lucide-react'
import { useMinimumLoading } from '@/shared/hooks/useMinimumLoading'
import { buttonClass, type ButtonSize, type ButtonVariant } from './button-styles'
import { Spinner } from './Spinner'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
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
      className={buttonClass(variant, size, className)}
      {...props}
    >
      {showSpinner ? <Spinner size={iconSize} /> : Icon && <Icon size={iconSize} strokeWidth={2} />}
      {children}
    </button>
  )
}

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: LucideIcon
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={buttonClass(variant, size, typeof className === 'string' ? className : undefined)}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 16} strokeWidth={2} />}
      {children}
    </Link>
  )
}
