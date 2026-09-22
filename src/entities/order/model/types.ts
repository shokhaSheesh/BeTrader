import type { AccountJoin, InvestorJoin, ProjectJoin } from '@/shared/api/joins'

/** Raw row of `orders`. `otp` (a one-time password) is deliberately NOT mapped: it's never shown. */
export interface OrderDto {
  guid: string
  /** "Order id" (INCREMENT_ID, set by the backend) */
  external_order_id: string | null
  /** "Tranasction Id" (sic) */
  transaction_id: string | null
  type: string[] | null
  status: string[] | null
  currency: string[] | null
  from_account: string[] | null
  to_account: string[] | null
  amount_uzs: number | null
  amount_usd: number | null
  amount_uzs_with_fee: number | null
  amount_usd_with_fee: number | null
  transaction_fee: number | null
  insurance: number | null
  is_insurance: boolean | null
  currency_rate: number | null
  deposit_maturity_date: string | null
  investors_id: string | null
  investors_id_data: InvestorJoin
  projects_id: string | null
  projects_id_data: ProjectJoin
  account_id: string | null
  account_id_data: AccountJoin
  created_time: string | null
  updated_time: string | null
}

export interface Order {
  id: string
  orderId: string | null
  transactionId: string | null
  type: string[]
  status: string[]
  currency: string[]
  fromAccount: string[]
  toAccount: string[]
  amountUzs: number | null
  amountUsd: number | null
  amountUzsWithFee: number | null
  amountUsdWithFee: number | null
  transactionFee: number | null
  insurance: number | null
  isInsurance: boolean | null
  currencyRate: number | null
  depositMaturityDate: string | null
  investorId: string | null
  investorName: string | null
  investorPhone: string | null
  projectId: string | null
  projectName: string | null
  accountId: string | null
  createdTime: string | null
  updatedTime: string | null
}

export function toOrder(d: OrderDto): Order {
  return {
    id: d.guid,
    orderId: d.external_order_id || null,
    transactionId: d.transaction_id || null,
    type: d.type ?? [],
    status: d.status ?? [],
    currency: d.currency ?? [],
    fromAccount: d.from_account ?? [],
    toAccount: d.to_account ?? [],
    amountUzs: d.amount_uzs,
    amountUsd: d.amount_usd,
    amountUzsWithFee: d.amount_uzs_with_fee,
    amountUsdWithFee: d.amount_usd_with_fee,
    transactionFee: d.transaction_fee,
    insurance: d.insurance,
    isInsurance: d.is_insurance,
    currencyRate: d.currency_rate,
    depositMaturityDate: d.deposit_maturity_date,
    investorId: d.investors_id,
    investorName: d.investors_id_data?.full_name || null,
    investorPhone: d.investors_id_data?.phone || null,
    projectId: d.projects_id,
    projectName: d.projects_id_data?.name_en || null,
    accountId: d.account_id,
    createdTime: d.created_time,
    updatedTime: d.updated_time,
  }
}
