import { useMemo } from 'react'
import { looksLikeHtml, sanitizeHtml } from '@/shared/lib/html'
import { Dash } from './cells'

/**
 * A long text as the app shows it: HTML from u-code's rich-text editor rendered with its
 * formatting (sanitized first), plain text with its line breaks kept.
 */
export function RichText({ value }: { value: string | null | undefined }) {
  const html = useMemo(() => (value && looksLikeHtml(value) ? sanitizeHtml(value) : null), [value])
  if (!value) return <Dash />
  if (!html) return <span className="whitespace-pre-line">{value}</span>
  return (
    <div
      className="max-w-prose space-y-2 [&_a]:underline [&_a]:underline-offset-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5"
      // Sanitized: formatting tags only, no attributes but safe link addresses (shared/lib/html)
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
