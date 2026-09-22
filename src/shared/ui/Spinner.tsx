import { LoaderCircle } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export function Spinner({ size = 16, className }: { size?: number; className?: string }) {
  return <LoaderCircle size={size} className={cn('animate-spin', className)} aria-hidden="true" />
}
