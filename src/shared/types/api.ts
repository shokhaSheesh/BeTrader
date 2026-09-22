export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

export interface ApiError {
  code: string
  message: string
}
