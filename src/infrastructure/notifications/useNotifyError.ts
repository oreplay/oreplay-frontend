import { useNotifications } from "@toolpad/core/useNotifications"
import { useTranslation } from "react-i18next"
import { httpErrorMessageKey } from "./httpError.ts"

/**
 * Shows an error snackbar for a failed request, mapping its HTTP status to a
 * translated `Gui.error.*` message via the host's notification system.
 */
export function useNotifyError(): (error: unknown) => void {
  const notifications = useNotifications()
  const { t } = useTranslation()
  return (error: unknown) => {
    notifications.show(t(httpErrorMessageKey(error)), {
      severity: "error",
      autoHideDuration: 5000,
    })
  }
}
