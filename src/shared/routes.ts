export const DASHBOARD_PATH = "/dashboard"
export const RANKING_LIST_PATH = "/admin/rankings"

export const rankingSettingsPath = (rankingId: string): string =>
  `${RANKING_LIST_PATH}/${rankingId}/settings`

export const rankingCreatePath = (): string => `${RANKING_LIST_PATH}/new`

export const rankingDuplicatedRunnersPath = (rankingId: string): string =>
  `${RANKING_LIST_PATH}/${rankingId}/duplicated-runners`

export const rankingOrganizersPath = (
  rankingId: string,
  eventId: string,
  stageId: string,
  stageOrderId: string,
): string =>
  `${RANKING_LIST_PATH}/${rankingId}/events/${eventId}/stages/${stageId}/stage-orders/${stageOrderId}/organizers`
