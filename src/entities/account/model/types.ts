/** Raw row of the u-code `account` table. Comments are the backend's labels (currency is in the label). */
export interface AccountDto {
  guid: string
  /** "Full Name" (the account's own field, separate from the investor's name) */
  full_name: string | null
  /** "Deposit (UZS)" */
  deposit: number | null
  /** "Investment (USD)" */
  invest: number | null
  /** "Interest income (USD)" */
  dividend: number | null
  /** "Tranzit (UZS)" */
  tranzit: number | null
  investors_id: string | null
  /** Whole investor record joined in; we read only name and phone (docs/API.md) */
  investors_id_data: { full_name: string | null; phone: string | null } | null
  created_at: string
  updated_at: string
}

export interface Account {
  id: string
  fullName: string | null
  deposit: number | null
  invest: number | null
  interestIncome: number | null
  tranzit: number | null
  investorId: string | null
  investorName: string | null
  investorPhone: string | null
  createdAt: string
  updatedAt: string
}

export function toAccount(dto: AccountDto): Account {
  return {
    id: dto.guid,
    fullName: dto.full_name || null,
    deposit: dto.deposit,
    invest: dto.invest,
    interestIncome: dto.dividend,
    tranzit: dto.tranzit,
    investorId: dto.investors_id,
    investorName: dto.investors_id_data?.full_name || null,
    investorPhone: dto.investors_id_data?.phone || null,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  }
}
