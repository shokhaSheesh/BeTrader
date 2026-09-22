import { useEffect, useState } from 'react'

/**
 * Keeps a loading flag on for at least `minMs` from when it turned on,
 * so fast requests don't flicker (DESIGN.md §1).
 */
export function useMinimumLoading(loading: boolean, minMs = 300) {
  const [prevLoading, setPrevLoading] = useState(loading)
  const [holding, setHolding] = useState(loading)

  // Adjust state during render when the input changes (no effect round-trip).
  if (loading !== prevLoading) {
    setPrevLoading(loading)
    if (loading) setHolding(true)
  }

  useEffect(() => {
    if (!holding) return
    const timer = setTimeout(() => setHolding(false), minMs)
    return () => clearTimeout(timer)
  }, [holding, minMs])

  return loading || holding
}
