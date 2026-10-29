import { useCallback, useSyncExternalStore } from "react"
import { Query, QueryCache, useQueryClient } from "react-query"
import { findOutdatedQuery } from "./outdatedData.ts"

/**
 * Describes a cached query in the terms `findOutdatedQuery` needs.
 * @param query A query from the cache.
 * @returns Its health: whether it is on screen, failed, and still holds data.
 */
function toQueryHealth(query: Query) {
  return {
    error: query.state.error,
    hasData: query.state.data !== undefined,
    isActive: query.isActive(),
    isError: query.state.status === "error",
  }
}

/**
 * Reads the error behind the first outdated query on screen.
 * @param cache The app's query cache.
 * @returns That query's error, or `undefined` when everything shown is current. The error object
 * stays the same until the query changes, so it is a stable snapshot.
 */
function readOutdatedError(cache: QueryCache): unknown {
  return findOutdatedQuery(cache.getAll().map(toQueryHealth))?.error
}

/**
 * Watches every query on screen — event detail, class and club lists, runners — and reports when
 * any of them keeps showing data from an earlier load because its latest refresh failed.
 * @returns The failure of the first outdated query, or `undefined` when everything shown is
 * current.
 */
export function useOutdatedDataError(): unknown {
  const cache = useQueryClient().getQueryCache()
  const subscribe = useCallback((onChange: () => void) => cache.subscribe(onChange), [cache])
  const getSnapshot = useCallback(() => readOutdatedError(cache), [cache])

  return useSyncExternalStore(subscribe, getSnapshot)
}
