/**
 * Demo mode: every API call is answered in the browser by the mock backend (shared/mock) with
 * made-up data, and nothing reaches u-code. **On by default**; a build with `VITE_MOCK=false`
 * talks to the real backend again, with no other change.
 */
export const MOCK_MODE = import.meta.env.VITE_MOCK !== 'false'
