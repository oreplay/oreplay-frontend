import { useEffect } from "react"
import { useNotifications } from "@toolpad/core/useNotifications"
import {
  RankingRoutes,
  RANKING_NOTIFICATION_EVENT,
  type RankingNotificationDetail,
} from "@oreplay/ranking"
import { API_DOMAIN } from "../../services/ApiConfig.ts"
import { useAuth } from "../../shared/hooks.ts"

/**
 * Host adapter for the external ranking module. It injects the API base URL and
 * the session data so authentication is not done in the ranking module, and
 * bridges the module's notification events to the host's MUI notifications.
 */
export default function RankingModule() {
  const { token } = useAuth()
  const notifications = useNotifications()

  useEffect(() => {
    const handleNotification = (event: Event) => {
      const { message, severity } = (event as CustomEvent<RankingNotificationDetail>).detail
      notifications.show(message, { severity, autoHideDuration: 5000 })
    }
    window.addEventListener(RANKING_NOTIFICATION_EVENT, handleNotification)
    return () => window.removeEventListener(RANKING_NOTIFICATION_EVENT, handleNotification)
  }, [notifications])

  return <RankingRoutes apiBaseUrl={API_DOMAIN} authToken={token} />
}
