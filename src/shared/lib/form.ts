import { z } from 'zod'

/** Optional numeric text input ("", "300", "1 250.5"). Required-ness is the backend's call (DESIGN.md §0). */
export const numericText = z
  .string()
  .trim()
  .refine((v) => v === '' || /^-?\d+([.,]\d+)?$/.test(v.replace(/\s/g, '')), 'Enter a number')

export const numberToText = (value: number | null | undefined) =>
  value == null ? '' : String(value)
