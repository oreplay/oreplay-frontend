import { isAxiosError } from "axios"

export function httpErrorMessageKey(error: unknown): string {
  const status = isAxiosError(error) ? error.response?.status : undefined
  if (status === 403) return "Gui.error.forbidden"
  if (status !== undefined && status >= 500) return "Gui.error.serverError"
  if (status !== undefined && status >= 400) return "Gui.error.badRequest"
  return "Gui.error.serverError"
}
