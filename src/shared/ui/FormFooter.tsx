import { ButtonLink, Button } from './Button'

/** Cancel / Save panel at the end of every create and edit page; it floats at the bottom while the form scrolls. */
export function FormFooter({
  cancelTo,
  submitLabel,
  submitting,
}: {
  cancelTo: string
  submitLabel: string
  submitting?: boolean
}) {
  return (
    <div className="sticky bottom-0 z-10 mt-6 flex justify-end gap-2 rounded-md border border-line bg-surface px-6 py-4 shadow-popover">
      <ButtonLink to={cancelTo} variant="secondary">
        Cancel
      </ButtonLink>
      <Button type="submit" loading={submitting}>
        {submitLabel}
      </Button>
    </div>
  )
}
