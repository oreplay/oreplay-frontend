import { useQueryClient } from "react-query"
import { useNotifyError } from "../../../../../infrastructure/notifications/useNotifyError.ts"
import {
  getGetListRankingOrganizersQueryKey,
  useDeleteRankingOrganizers,
  useGetListRankingOrganizers,
  usePostListRankingOrganizers,
} from "../../../../../infrastructure/repositories/ranking-organizers/ranking-organizers.ts"
import { RankingOrganizer } from "../../../../../domain/types/v1api"
import { RankingOrganizerFormState, toPostBody } from "./rankingOrganizerForm.ts"

export interface RankingOrganizersParams {
  rankingId?: string
  eventId?: string
  stageId?: string
  stageOrderId?: string
}

export function useRankingOrganizers(params: RankingOrganizersParams) {
  const notifyError = useNotifyError()
  const queryClient = useQueryClient()

  const ids = {
    rankingID: params.rankingId ?? "",
    eventID: params.eventId ?? "",
    stageID: params.stageId ?? "",
    stageOrderID: params.stageOrderId ?? "",
  }

  const list = useGetListRankingOrganizers(
    ids.rankingID,
    ids.eventID,
    ids.stageID,
    ids.stageOrderID,
  )
  const create = usePostListRankingOrganizers()
  const remove = useDeleteRankingOrganizers()

  const invalidateList = () =>
    queryClient.invalidateQueries(
      getGetListRankingOrganizersQueryKey(
        ids.rankingID,
        ids.eventID,
        ids.stageID,
        ids.stageOrderID,
      ),
    )

  const add = async (state: RankingOrganizerFormState): Promise<boolean> => {
    try {
      await create.mutateAsync({ ...ids, data: toPostBody(state) })
      await invalidateList()
      return true
    } catch (error) {
      notifyError(error)
      return false
    }
  }

  const removeOrganizer = async (organizer: RankingOrganizer): Promise<boolean> => {
    try {
      await remove.mutateAsync({ ...ids, organizerID: organizer.id })
      await invalidateList()
      return true
    } catch (error) {
      notifyError(error)
      return false
    }
  }

  return {
    rankingId: ids.rankingID,
    organizers: list.data?.data ?? [],
    isLoading: list.isLoading,
    isError: list.isError,
    isAdding: create.isLoading,
    isRemoving: remove.isLoading,
    add,
    removeOrganizer,
  }
}
