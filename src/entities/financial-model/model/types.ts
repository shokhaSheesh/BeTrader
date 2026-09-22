/** Raw row of the u-code `financial_modeling` table. */
export interface FinancialModelDto {
  guid: string
  /** "Project Key Name", e.g. SP500 */
  project_key_name: string | null
  /** DATE */
  date: string | null
  /** "Price": currency not stated */
  price: number | null
  created_at: string
  updated_at: string
}

export interface FinancialModel {
  id: string
  projectKeyName: string | null
  date: string | null
  price: number | null
  createdAt: string
  updatedAt: string
}

export const toFinancialModel = (d: FinancialModelDto): FinancialModel => ({
  id: d.guid,
  projectKeyName: d.project_key_name || null,
  date: d.date || null,
  price: d.price,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
