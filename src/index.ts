export { default as RankingRoutes } from "./RankingRoutes.tsx"

// Notification contract for the host: it listens for `RANKING_NOTIFICATION_EVENT`
// on `window` and renders `RankingNotificationDetail` with its own UI.
export { RANKING_NOTIFICATION_EVENT } from "./infrastructure/notifications/notifications.ts"
export type {
  RankingNotificationDetail,
  NotificationSeverity,
} from "./infrastructure/notifications/notifications.ts"
