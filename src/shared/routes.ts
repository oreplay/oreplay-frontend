export const DASHBOARD_PATH = "/dashboard"
export const RANKING_LIST_PATH = "/admin/rankings"

export const rankingSettingsPath = (rankingId: string): string =>
  `${RANKING_LIST_PATH}/${rankingId}/settings`
