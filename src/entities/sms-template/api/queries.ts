import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toSmsTemplate } from '../model/types'

export const SMS_TEMPLATES_TABLE = 'sms_template'

export const useSmsTemplatesQuery = (params: ListParams) =>
  useTableListQuery(SMS_TEMPLATES_TABLE, params, toSmsTemplate)
export const useSmsTemplateQuery = (id: string | undefined) =>
  useTableItemQuery(SMS_TEMPLATES_TABLE, id, toSmsTemplate)
