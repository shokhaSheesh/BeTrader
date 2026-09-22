// Shared class strings so every control looks identical (DESIGN.md §3).

export const controlBase =
  'flex w-full items-center rounded-sm border border-transparent bg-surface-muted px-3 text-left outline-none transition-colors placeholder:text-fg-subtle focus:border-focus focus-visible:border-focus data-[state=open]:border-focus aria-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-50'

export const controlSizes = { sm: 'h-8 text-sm', md: 'h-11' } as const

export const popoverSurface =
  'z-50 overflow-hidden rounded-sm border border-line bg-surface p-1 shadow-popover outline-none'

export const menuItem =
  'flex h-9 cursor-pointer items-center gap-2 rounded-xs px-2.5 outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-surface-muted'

/** Filter triggers sit on the canvas, so they're white. An active filter gets an ink border and bold value. */
export const filterTrigger =
  'inline-flex h-10 items-center gap-2 rounded-sm border border-transparent bg-surface px-3 whitespace-nowrap outline-none transition-colors hover:border-line-strong focus-visible:border-focus data-[state=open]:border-focus data-[active=true]:border-focus'
