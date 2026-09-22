import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toLinkSetting } from '../model/types'

export const LINK_SETTINGS_TABLE = 'link_settings'

export const useLinkSettingsQuery = (params: ListParams) =>
  useTableListQuery(LINK_SETTINGS_TABLE, params, toLinkSetting)
export const useLinkSettingQuery = (id: string | undefined) =>
  useTableItemQuery(LINK_SETTINGS_TABLE, id, toLinkSetting)
