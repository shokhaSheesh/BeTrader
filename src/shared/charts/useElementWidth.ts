import { useEffect, useState } from 'react'

/** Width of an element, kept in sync on resize (charts render at their container's width). */
export function useElementWidth() {
  const [el, setEl] = useState<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)))
    observer.observe(el)
    return () => observer.disconnect()
  }, [el])
  return [setEl, width] as const
}
