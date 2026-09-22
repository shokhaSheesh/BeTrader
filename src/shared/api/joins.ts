// Linked records the backend joins into rows (`<field>_data`). We read only what the admin shows;
// the backend joins the whole record (incl. secrets), see docs/API.md.
export type InvestorJoin = {
  full_name: string | null
  phone: string | null
  passport?: string | null
} | null
export type PolicyTypeJoin = { label_en: string | null } | null
export type ProjectJoin = { name_en: string | null } | null
export type AccountJoin = { deposit: number | null; invest: number | null } | null
export type CardJoin = { masked_pan: string | null; type: string | null } | null
export type OrderJoin = { external_order_id: string | null } | null
export type NameJoin = { name: string | null } | null
