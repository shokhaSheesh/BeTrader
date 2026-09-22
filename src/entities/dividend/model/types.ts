import type { InvestorJoin, ProjectJoin } from '@/shared/api/joins'

/** Raw row of `dividend`. */
export interface DividendDto {
  guid: string
  type: string[] | null
  percent: number | null
  days: number | null
  period_days: number | null
  /** "Order amount": currency not stated */
  order_amount: number | null
  amount_uzs: number | null
  amount_usd: number | null
  from_date: string | null
  to_date: string | null
  investors_id: string | null
  investors_id_data: InvestorJoin
  projects_id: string | null
  projects_id_data: ProjectJoin
  created_at: string
  updated_at: string
}

export interface Dividend {
  id: string
  type: string[]
  percent: number | null
  days: number | null
  periodDays: number | null
  orderAmount: number | null
  amountUzs: number | null
  amountUsd: number | null
  fromDate: string | null
  toDate: string | null
  investorId: string | null
  investorName: string | null
  investorPhone: string | null
  projectId: string | null
  projectName: string | null
  createdAt: string
  updatedAt: string
}

export function toDividend(d: DividendDto): Dividend {
  return {
    id: d.guid,
    type: d.type ?? [],
    percent: d.percent,
    days: d.days,
    periodDays: d.period_days,
    orderAmount: d.order_amount,
    amountUzs: d.amount_uzs,
    amountUsd: d.amount_usd,
    fromDate: d.from_date,
    toDate: d.to_date,
    investorId: d.investors_id,
    investorName: d.investors_id_data?.full_name || null,
    investorPhone: d.investors_id_data?.phone || null,
    projectId: d.projects_id,
    projectName: d.projects_id_data?.name_en || null,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  }
}
