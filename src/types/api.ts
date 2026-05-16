export interface ApiErrorBody {
  code: string
  message: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: ApiErrorBody | null
}
