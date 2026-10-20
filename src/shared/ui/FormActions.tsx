import { ButtonLink, Button } from './Button'

/**
 * Cancel / Save bar at the top of every create and edit form. It stays pinned at the top of the
 * page while the form scrolls, so saving never needs a scroll to the end.
 */
export function FormActions({
  cancelTo,
  submitLabel,
  submitting,
}: {
  cancelTo: string
  submitLabel: string
  submitting?: boolean
}) {
  return (
    // Pinned at the very top of the scrolling area (over its 24px padding, hence -top-6), on a
    // strip of page background so scrolled content never shows above the bar. -mt-6 / pt-6 keep
    // its place in the form unchanged.
    <div className="sticky -top-6 z-10 -mx-6 -mt-6 bg-canvas px-6 pt-6">
      <div className="flex justify-end gap-2 rounded-md border border-line bg-surface px-6 py-4 shadow-popover">
        <ButtonLink to={cancelTo} variant="secondary">
          Cancel
        </ButtonLink>
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
