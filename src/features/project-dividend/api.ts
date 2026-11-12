import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ACCOUNTS_TABLE } from '@/entities/account'
import { DIVIDENDS_TABLE } from '@/entities/dividend'
import { PROJECT_INVESTORS_TABLE } from '@/entities/project-investor'
import { http } from '@/shared/api/http'
import { WriteBlockedError } from '@/shared/api/ucode'
import { MOCK_MODE } from '@/shared/config/mock'
import { translate } from '@/shared/i18n'

export interface CreateDividendInput {
  projectId: string
  /** ISO timestamps: start of the first day, end of the last */
  from: string
  to: string
  /** The total amount to distribute among the project's investors */
  profit: number
}

/**
 * u-code's "Divident" button on a project (custom event → the `betrader_test_divident`
 * microfrontend) sends exactly this to the backend gateway function, which works out each
 * investor's share (docs/API.md → "Detail pages"). Here it runs in demo mode only: with the
 * real backend it would trigger a real distribution, so it's refused until that's agreed.
 */
async function createDividend({ projectId, from, to, profit }: CreateDividendInput) {
  if (!MOCK_MODE)
    throw new WriteBlockedError(
      translate('Creating dividends works in demo mode only for now. Nothing was sent.'),
    )
  const { data } = await http.post<{ data: { created: number } }>(
    '/v2/invoke_function/betrader-gateway',
    {
      data: {
        method: 'create',
        table: 'dividends',
        object_data: { from, to, projects_id: projectId, profit },
      },
    },
  )
  return data.data
}

export function useCreateDividendMutation() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: createDividend,
    // The distribution adds dividend rows and raises each holding's interest income
    onSettled: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: [DIVIDENDS_TABLE] }),
        client.invalidateQueries({ queryKey: [PROJECT_INVESTORS_TABLE] }),
        client.invalidateQueries({ queryKey: [ACCOUNTS_TABLE] }),
      ]),
  })
}
