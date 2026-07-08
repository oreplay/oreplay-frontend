export interface BreadcrumbItem {
  label: string
  /** Absolute route to link to. Omitted for the current (last) page. */
  to?: string
}

// Absolute host routes used in the ranking breadcrumb trail.
export const DASHBOARD_PATH = "/dashboard"
export const RANKING_LIST_PATH = "/rankings"

interface TrailLabels {
  dashboard: string
  ranking: string
}

/** `Dashboard > Ranking` — the list view; `Ranking` is the current page. */
export function buildRankingListBreadcrumbs(labels: TrailLabels): BreadcrumbItem[] {
  return [{ label: labels.dashboard, to: DASHBOARD_PATH }, { label: labels.ranking }]
}

/** `Dashboard > Ranking > <selected ranking>` — the settings view. */
export function buildRankingSettingsBreadcrumbs(
  labels: TrailLabels,
  rankingLabel: string,
): BreadcrumbItem[] {
  return [
    { label: labels.dashboard, to: DASHBOARD_PATH },
    { label: labels.ranking, to: RANKING_LIST_PATH },
    { label: rankingLabel },
  ]
}
