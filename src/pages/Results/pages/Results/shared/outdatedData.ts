export interface QueryHealth {
  error: unknown
  hasData: boolean
  isActive: boolean
  isError: boolean
}

/**
 * Finds the first query on screen whose data is outdated — its latest refresh failed while data
 * from an earlier load is still shown. Queries nobody is using right now (other pages, the hidden
 * class/club view) are ignored, since their data is not on screen.
 * @param queries Health of every cached query.
 * @returns The first outdated query on screen, or `undefined` when everything shown is current.
 */
export function findOutdatedQuery<T extends QueryHealth>(queries: readonly T[]): T | undefined {
  return queries.find(
    (query) => query.isActive && isShowingOutdatedData(query.isError, query.hasData),
  )
}

/**
 * Tells whether the page is showing data from an earlier load because the latest refresh failed.
 * A failure with nothing loaded yet is not outdated data: the page shows an error instead.
 * @param isError Whether the latest request failed.
 * @param hasData Whether data from an earlier successful load is still available.
 * @returns `true` when the data on screen may no longer be current.
 */
export function isShowingOutdatedData(isError: boolean, hasData: boolean): boolean {
  return isError && hasData
}
