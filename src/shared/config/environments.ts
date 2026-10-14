/**
 * The BeTrader project's u-code environments (auth API `GET /v2/resource-environment`).
 *
 * The environment is bound to the **session** on u-code's side: the data API ignores the
 * `environment-id` / `resource-id` headers (any value, even a made-up one, reads the session's
 * database). A session is moved into an environment with `PUT /v2/refresh { env_id }`.
 * Login always starts in Production, so `login()` switches it right away (docs/API.md).
 */
export const ENVIRONMENTS = {
  production: {
    id: '0b7d0ea1-43af-42b3-92fa-829c497a14f9',
    resourceId: '3c4e9c05-ffab-4f9e-95b3-1a16b0f53d42',
    label: 'Production',
  },
  test: {
    id: '07226aec-23df-4c7d-b685-2de52572abc2',
    resourceId: 'a72c0c6b-2c91-4680-b8f6-062062874fe6',
    label: 'Test',
  },
} as const

/**
 * The environment the admin works in. **Test** unless the build sets
 * `VITE_ENVIRONMENT=production`, so writes are proven on test data first.
 */
export const TARGET_ENVIRONMENT =
  import.meta.env.VITE_ENVIRONMENT === 'production' ? ENVIRONMENTS.production : ENVIRONMENTS.test

/**
 * Create, edit, delete and upload run only in these environments, whatever the build says.
 * Production joins the list once writes are approved there.
 */
export const WRITABLE_ENVIRONMENT_IDS: readonly string[] = [ENVIRONMENTS.test.id]

/**
 * Tables whose rows are app login accounts. Login accounts live in u-code's auth service and are
 * **shared by every environment**: a Test investor copied from Production points to the same
 * account (verified 2026-10-14). Deleting such a row outside Production could remove a real
 * person's login, so it's refused there.
 */
export const SHARED_LOGIN_TABLES: readonly string[] = ['investors']
