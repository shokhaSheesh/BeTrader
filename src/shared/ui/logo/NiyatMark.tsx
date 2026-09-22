import type { SVGProps } from 'react'

/** The Niyat "N" glyph, traced from the brand app icon. Inherits color from `currentColor`. */
export function NiyatGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 150 37" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M0 37 43 0h40v37H66V1.8h-3.1L21 37Z" />
      <path d="M86 37 129 0h21l-43 37Z" />
    </svg>
  )
}

/** App-icon style mark: ink glyph on a lime tile. */
export function NiyatMark({ size = 32 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-sm bg-accent text-on-accent"
      style={{ width: size, height: size }}
    >
      <NiyatGlyph style={{ width: size * 0.66 }} />
    </span>
  )
}
