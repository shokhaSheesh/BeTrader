/** Legend: a swatch that mirrors the mark (line key for lines, square for bars) + text in text color. */
export function Legend({
  items,
  mark,
}: {
  items: { name: string; color: string }[]
  mark: 'line' | 'rect'
}) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-fg-muted">
      {items.map((i) => (
        <li key={i.name} className="flex items-center gap-2">
          <span
            className={mark === 'line' ? 'h-0.5 w-4 rounded-full' : 'size-2.5 rounded-xs'}
            style={{ background: i.color }}
            aria-hidden="true"
          />
          {i.name}
        </li>
      ))}
    </ul>
  )
}
