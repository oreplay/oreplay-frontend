import { isAxiosError } from "axios"

export function httpErrorMessageKey(error: unknown): string {
  const status = isAxiosError(error) ? error.response?.status : undefined
  if (status === 403) return "Ranking.gui.error.forbidden"
  if (status !== undefined && status >= 500) return "Ranking.gui.error.serverError"
  if (status !== undefined && status >= 400) return "Ranking.gui.error.badRequest"
  return "Ranking.gui.error.serverError"
}
