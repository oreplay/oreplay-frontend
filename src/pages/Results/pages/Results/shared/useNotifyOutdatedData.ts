import { useEffect, useRef } from "react"
import { useNotifyError } from "../../../../../infrastructure/notifications/useNotifyError.ts"

/**
 * Shows an error snackbar when the page starts showing outdated data, i.e. when a refresh fails
 * while earlier data stays on screen. It notifies once per outage, not on every failed retry or
 * poll, and again only after a successful refresh followed by a new failure.
 * @param isOutdated Whether the data on screen comes from an earlier load.
 * @param error The failure of the latest refresh, mapped to the snackbar's message.
 */
export function useNotifyOutdatedData(isOutdated: boolean, error: unknown) {
  const notifyError = useNotifyError()
  const wasOutdated = useRef(false)

  useEffect(() => {
    if (isOutdated && !wasOutdated.current) {
      notifyError(error)
    }
    wasOutdated.current = isOutdated
  })
}
