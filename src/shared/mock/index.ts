import axios from 'axios'
import { mockAdapter } from './adapter'

/**
 * Routes every axios request (the shared clients and the plain `axios` calls of login and
 * refresh) to the mock backend. Called once, before the first request, when MOCK_MODE is on.
 */
export function installMockBackend(...clients: { defaults: { adapter?: unknown } }[]) {
  axios.defaults.adapter = mockAdapter
  for (const client of clients) client.defaults.adapter = mockAdapter
}
