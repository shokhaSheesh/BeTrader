import { ButtonLink, Button } from './Button'

/** Sticky Cancel / Save bar at the bottom of every create and edit page. */
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
    <div className="sticky -bottom-6 z-10 -mx-6 mt-6 -mb-6 flex justify-end gap-2 border-t border-line bg-surface px-6 py-4">
      <ButtonLink to={cancelTo} variant="secondary">
        Cancel
      </ButtonLink>
      <Button type="submit" loading={submitting}>
        {submitLabel}
      </Button>
    </div>
  )
}
