import { z } from 'zod'

/** Optional numeric text input ("", "300", "1 250.5"). Required-ness is the backend's call (DESIGN.md §0). */
export const numericText = z
  .string()
  .trim()
  .refine((v) => v === '' || /^-?\d+([.,]\d+)?$/.test(v.replace(/\s/g, '')), 'Enter a number')

export const numberToText = (value: number | null | undefined) =>
  value == null ? '' : String(value)

/** The inverse of `numericText`: "1 250,5" → 1250.5, "" → null (the field is cleared). */
export const textToNumber = (text: string): number | null => {
  const clean = text.replace(/\s/g, '').replace(',', '.')
  return clean === '' ? null : Number(clean)
}

/**
 * Values a new record starts with, from the backend's field defaults (`attributes.defaultValue`).
 * `"NOW"` on a date field means the moment of creation, so it is resolved when the record is sent.
 */
export function createDefaults(fields: { slug: string; defaultValue?: unknown }[]) {
  return Object.fromEntries(
    fields
      .filter(
        (f) => f.defaultValue !== undefined && f.defaultValue !== '' && f.defaultValue !== null,
      )
      .map((f) => [f.slug, f.defaultValue === 'NOW' ? new Date().toISOString() : f.defaultValue]),
  )
}

/**
 * Keeps only the fields the user changed (react-hook-form's `dirtyFields`), so an edit never
 * rewrites values nobody touched. u-code's PUT updates just the fields sent.
 */
export function changedOnly(
  payload: Record<string, unknown>,
  dirtyFields: Record<string, unknown>,
): Record<string, unknown> {
  const isDirty = (flag: unknown): boolean =>
    Array.isArray(flag)
      ? flag.some(isDirty)
      : typeof flag === 'object' && flag !== null
        ? Object.values(flag).some(isDirty)
        : flag === true
  return Object.fromEntries(Object.entries(payload).filter(([key]) => isDirty(dirtyFields[key])))
}
