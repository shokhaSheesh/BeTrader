import { useTableItemQuery, useTableListQuery } from '@/shared/api/queries'
import type { ListParams } from '@/shared/api/ucode'
import { toDocumentItem } from '../model/types'

export const DOCUMENTS_TABLE = 'documents'

export const useDocumentsQuery = (params: ListParams) =>
  useTableListQuery(DOCUMENTS_TABLE, params, toDocumentItem)
export const useDocumentItemQuery = (id: string | undefined) =>
  useTableItemQuery(DOCUMENTS_TABLE, id, toDocumentItem)
