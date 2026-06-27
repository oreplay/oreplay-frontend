// The module can't reach the host's UI, so it emits a typed `window` event the
// host listens for and renders with its own notifications (MUI in the host).

export type NotificationSeverity = "error" | "success" | "warning" | "info"

export interface RankingNotificationDetail {
  message: string
  severity: NotificationSeverity
}

export const RANKING_NOTIFICATION_EVENT = "oreplay:ranking-notification"

export function emitRankingNotification(
  detail: RankingNotificationDetail,
): void {
  window.dispatchEvent(
    new CustomEvent<RankingNotificationDetail>(RANKING_NOTIFICATION_EVENT, {
      detail,
    }),
  )
}

export function notifyError(message: string): void {
  emitRankingNotification({ message, severity: "error" })
}
