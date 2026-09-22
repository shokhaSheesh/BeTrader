import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toReferralLink } from '../model/types'

export const REFERRAL_LINKS_TABLE = 'referral_links'

export const useReferralLinksQuery = (params: ListParams) =>
  useTableListQuery(REFERRAL_LINKS_TABLE, params, toReferralLink)
export const useReferralLinkQuery = (id: string | undefined) =>
  useTableItemQuery(REFERRAL_LINKS_TABLE, id, toReferralLink)
