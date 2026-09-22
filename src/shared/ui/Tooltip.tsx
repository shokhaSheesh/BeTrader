import type { ReactNode } from 'react'
import { Tooltip as T } from 'radix-ui'

/** Custom tooltip: never the native `title` attribute (DESIGN.md §3). */
export function Tooltip({
  content,
  side = 'right',
  children,
}: {
  content: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  children: ReactNode
}) {
  return (
    <T.Root delayDuration={200}>
      <T.Trigger asChild>{children}</T.Trigger>
      <T.Portal>
        <T.Content
          side={side}
          sideOffset={8}
          className="z-[80] rounded-xs bg-inverse px-2.5 py-1.5 text-xs font-medium text-on-inverse"
        >
          {content}
        </T.Content>
      </T.Portal>
    </T.Root>
  )
}

export const TooltipProvider = T.Provider
