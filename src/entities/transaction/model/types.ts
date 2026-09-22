import type { CardJoin, InvestorJoin, OrderJoin, ProjectJoin } from '@/shared/api/joins'

/** Raw row of `transactions`. `otp` (a one-time password) is deliberately NOT mapped: it's never shown. */
export interface TransactionDto {
  guid: string
  /** "Transaction Id" */
  external_id: string | null
  operation: string[] | null
  status: string[] | null
  /** "Type": free text "+" / "-" */
  type: string | null
  payment_type: string[] | null
  currency: string[] | null
  account: string[] | null
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
  score: number | null
  snapshot_full_name: string | null
  snapshot_phone: string | null
  snapshot_pinfl: string | null
  investors_id: string | null
  investors_id_data: InvestorJoin
  /** "Investors": a second investor link */
  investors_id_2: string | null
  investors_id_2_data: InvestorJoin
  projects_id: string | null
  projects_id_data: ProjectJoin
  orders_id: string | null
  orders_id_data: OrderJoin
  investor_cards_id: string | null
  investor_cards_id_data: CardJoin
  account_id: string | null
  created_time: string | null
  updated_time: string | null
}

export interface Transaction {
  id: string
  transactionId: string | null
  operation: string[]
  status: string[]
  direction: string | null
  paymentType: string[]
  currency: string[]
  account: string[]
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
  score: number | null
  snapshotName: string | null
  snapshotPhone: string | null
  snapshotPinfl: string | null
  investorId: string | null
  investorName: string | null
  investorPhone: string | null
  investor2Id: string | null
  investor2Name: string | null
  projectId: string | null
  projectName: string | null
  orderId: string | null
  orderNumber: string | null
  cardId: string | null
  cardPan: string | null
  accountId: string | null
  createdTime: string | null
  updatedTime: string | null
}

export function toTransaction(d: TransactionDto): Transaction {
  return {
    id: d.guid,
    transactionId: d.external_id || null,
    operation: d.operation ?? [],
    status: d.status ?? [],
    direction: d.type || null,
    paymentType: d.payment_type ?? [],
    currency: d.currency ?? [],
    account: d.account ?? [],
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
    score: d.score,
    snapshotName: d.snapshot_full_name || null,
    snapshotPhone: d.snapshot_phone || null,
    snapshotPinfl: d.snapshot_pinfl || null,
    investorId: d.investors_id,
    investorName: d.investors_id_data?.full_name || null,
    investorPhone: d.investors_id_data?.phone || null,
    investor2Id: d.investors_id_2,
    investor2Name: d.investors_id_2_data?.full_name || null,
    projectId: d.projects_id,
    projectName: d.projects_id_data?.name_en || null,
    orderId: d.orders_id,
    orderNumber: d.orders_id_data?.external_order_id || null,
    cardId: d.investor_cards_id,
    cardPan: d.investor_cards_id_data?.masked_pan || null,
    accountId: d.account_id,
    createdTime: d.created_time,
    updatedTime: d.updated_time,
  }
}
