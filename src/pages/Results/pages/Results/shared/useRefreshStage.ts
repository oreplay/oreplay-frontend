import { useCallback } from "react"
import { useQueryClient } from "react-query"
import { ClassModel, ClubModel } from "../../../../../shared/EntityTypes.ts"
import { getEventDetailQueryKey } from "../../../services/FetchHooks.ts"

interface RefetchableQuery {
  refetch: () => Promise<unknown>
}

interface UseRefreshStageParams {
  activeItem: ClassModel | ClubModel | null
  eventId: string
  refreshClassesClubs: () => Promise<unknown>
  shownRunnersQuery: RefetchableQuery
}

/**
 * Builds the stage's refresh action, shared by the refresh button and pull to refetch: it reloads
 * the event detail (so the stage's official state is current), the class and club lists, and the
 * runners on screen. Only the runners query being shown is refetched — refetching the hidden one
 * would request a club's runners with a class id, or vice versa — and none is when no class or
 * club is selected yet.
 * @param params.activeItem - The selected class or club, or `null` before one is chosen.
 * @param params.eventId - The event whose detail is reloaded.
 * @param params.refreshClassesClubs - Reloads the class and club lists.
 * @param params.shownRunnersQuery - The runners query for the current class/club view.
 * @returns A stable callback whose promise settles once every reload has finished.
 */
export function useRefreshStage({
  activeItem,
  eventId,
  refreshClassesClubs,
  shownRunnersQuery,
}: UseRefreshStageParams): () => Promise<unknown> {
  const queryClient = useQueryClient()
  const hasActiveItem = activeItem !== null
  const refetchRunners = shownRunnersQuery.refetch

  return useCallback(
    () =>
      Promise.all([
        queryClient.refetchQueries(getEventDetailQueryKey(eventId)),
        refreshClassesClubs(),
        hasActiveItem ? refetchRunners() : undefined,
      ]),
    [queryClient, eventId, hasActiveItem, refreshClassesClubs, refetchRunners],
  )
}
