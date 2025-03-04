export interface ApiError {
  error: string
  error_fields?: Record<string, Record<string, object>>
}
