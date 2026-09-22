/**
 * Raw row of the u-code `investors` table: only the fields the admin shows.
 * Deliberately NOT mapped even though the backend sends them: `pin_code` (a secret),
 * `fmc_token` (push token), `user_id_auth`. See docs/API.md.
 */
export interface InvestorDto {
  guid: string
  full_name: string | null
  surname: string | null
  name: string | null
  patronymic: string | null
  phone: string | null
  passport: string | null
  pinfl: string | null
  issued_by: string | null
  /** SINGLE_LINE in the backend: shown as sent */
  issued_date: string | null
  /** SINGLE_LINE in the backend: shown as sent */
  birth_date: string | null
  birth_place: string | null
  citizenship: string | null
  country_name: string | null
  city: string | null
  district: string | null
  street: string | null
  /** MULTISELECT */
  gender: string[] | null
  /** MULTISELECT */
  lang: string[] | null
  /** MULTISELECT */
  platform_type: string[] | null
  is_identified: boolean | null
  score: number | null
  campaign: string | null
  media_source: string | null
  /** SINGLE_LINE with options (e.g. "dark") */
  mode: string | null
  /** "Tg Chat ID" */
  tg_caht_id: number | null
  image: string | null
  client_type_id_data: { name: string | null } | null
  role_id_data: { name: string | null } | null
  created_time: string
  updated_at: string
}

export interface Investor {
  id: string
  fullName: string | null
  surname: string | null
  name: string | null
  patronymic: string | null
  phone: string | null
  passport: string | null
  pinfl: string | null
  issuedBy: string | null
  issuedDate: string | null
  birthDate: string | null
  birthPlace: string | null
  citizenship: string | null
  country: string | null
  city: string | null
  district: string | null
  street: string | null
  gender: string[]
  languages: string[]
  platforms: string[]
  isIdentified: boolean
  score: number | null
  campaign: string | null
  mediaSource: string | null
  mode: string | null
  tgChatId: number | null
  imageUrl: string | null
  clientType: string | null
  role: string | null
  createdTime: string
  updatedAt: string
}

export function toInvestor(dto: InvestorDto): Investor {
  return {
    id: dto.guid,
    fullName: dto.full_name || null,
    surname: dto.surname || null,
    name: dto.name || null,
    patronymic: dto.patronymic || null,
    phone: dto.phone || null,
    passport: dto.passport || null,
    pinfl: dto.pinfl || null,
    issuedBy: dto.issued_by || null,
    issuedDate: dto.issued_date || null,
    birthDate: dto.birth_date || null,
    birthPlace: dto.birth_place || null,
    citizenship: dto.citizenship || null,
    country: dto.country_name || null,
    city: dto.city || null,
    district: dto.district || null,
    street: dto.street || null,
    gender: dto.gender ?? [],
    languages: dto.lang ?? [],
    platforms: dto.platform_type ?? [],
    isIdentified: dto.is_identified === true,
    score: dto.score,
    campaign: dto.campaign || null,
    mediaSource: dto.media_source || null,
    mode: dto.mode || null,
    tgChatId: dto.tg_caht_id,
    imageUrl: dto.image || null,
    clientType: dto.client_type_id_data?.name || null,
    role: dto.role_id_data?.name || null,
    createdTime: dto.created_time,
    updatedAt: dto.updated_at,
  }
}
