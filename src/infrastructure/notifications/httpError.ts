import { isAxiosError } from "axios"

export function httpErrorMessageKey(error: unknown): string {
  const status = isAxiosError(error) ? error.response?.status : undefined
  if (status === 403) return "common:error.forbidden"
  if (status !== undefined && status >= 500) return "common:error.serverError"
  if (status !== undefined && status >= 400) return "common:error.badRequest"
  return "common:error.serverError"
}
