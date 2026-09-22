import { toast } from '@/shared/lib/toast'

const TITLES = {
  create: "Creating isn't connected yet",
  save: "Saving isn't connected yet",
  delete: "Deleting isn't connected yet",
}

/**
 * POST / PUT / DELETE aren't wired to u-code yet (docs/API.md). Say so honestly
 * instead of faking success. Replace each call with the real mutation when it's wired.
 */
export function notWired(action: keyof typeof TITLES) {
  toast.info(TITLES[action], "The backend endpoint isn't wired yet, so nothing was changed.")
}
