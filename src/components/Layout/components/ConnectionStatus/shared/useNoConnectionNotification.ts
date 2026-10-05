import { useEffect } from "react"
import { useNotifications } from "@toolpad/core/useNotifications"
import { useTranslation } from "react-i18next"

export function useNoConnectionNotification(isOnline: boolean) {
  const { show, close } = useNotifications()
  const { t } = useTranslation()

  useEffect(() => {
    if (isOnline) return
    const notificationKey = show(t("common:noConnection"), { severity: "error" })
    return () => close(notificationKey)
  }, [isOnline, show, close, t])
}
