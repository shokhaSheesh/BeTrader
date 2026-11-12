import { useTableListQuery } from '@/shared/api/queries'
import { useT } from '@/shared/i18n'
import { formatMoney } from '@/shared/lib/format'
import { toAccount } from '../model/types'
import { ACCOUNTS_TABLE } from './queries'

/**
 * Accounts of one investor, for pickers. Account search is broken on the backend,
 * so we filter by investor (server-side) instead of searching. Nothing is fetched until an investor is picked.
 */
export function useInvestorAccountOptions(investorId: string | null) {
  const t = useT()
  const query = useTableListQuery(
    ACCOUNTS_TABLE,
    { page: 1, pageSize: 50, filters: { investors_id: investorId } },
    toAccount,
    { enabled: !!investorId },
  )
  const options = (query.data?.items ?? []).map((a) => ({
    value: a.id,
    label:
      [
        a.deposit != null && t('Deposit {amount}', { amount: formatMoney(a.deposit, 'UZS') }),
        a.invest != null && t('Investment {amount}', { amount: formatMoney(a.invest, 'USD') }),
      ]
        .filter(Boolean)
        .join(' · ') || a.id,
  }))
  return { ...query, options }
}
