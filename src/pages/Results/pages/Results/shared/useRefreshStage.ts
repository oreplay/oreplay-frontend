import { useCallback } from "react"
import { ClassModel, ClubModel } from "../../../../../shared/EntityTypes.ts"

interface RefetchableQuery {
  refetch: () => Promise<unknown>
}

interface UseRefreshStageParams {
  activeItem: ClassModel | ClubModel | null
  refreshClassesClubs: () => Promise<unknown>
  shownRunnersQuery: RefetchableQuery
}

/**
 * Builds the stage's refresh action, shared by the refresh button and pull to refetch: it reloads
 * the class and club lists plus the runners on screen. Only the query being shown is refetched —
 * refetching the hidden one would request a club's runners with a class id, or vice versa — and
 * none is when no class or club is selected yet.
 * @param params.activeItem - The selected class or club, or `null` before one is chosen.
 * @param params.refreshClassesClubs - Reloads the class and club lists.
 * @param params.shownRunnersQuery - The runners query for the current class/club view.
 * @returns A stable callback whose promise settles once every reload has finished.
 */
export function useRefreshStage({
  activeItem,
  refreshClassesClubs,
  shownRunnersQuery,
}: UseRefreshStageParams): () => Promise<unknown> {
  const hasActiveItem = activeItem !== null
  const refetchRunners = shownRunnersQuery.refetch

  return useCallback(
    () => Promise.all([refreshClassesClubs(), hasActiveItem ? refetchRunners() : undefined]),
    [hasActiveItem, refreshClassesClubs, refetchRunners],
  )
}
