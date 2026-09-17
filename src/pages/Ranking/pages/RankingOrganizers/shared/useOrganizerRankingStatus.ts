import { useQueryClient } from "react-query"
import { RankingOrganizer } from "../../../../../domain/types/v1api"
import { useNotifyError } from "../../../../../infrastructure/notifications/useNotifyError.ts"
import {
  getGetListResultsQueryKey,
  useGetListResults,
} from "../../../../../infrastructure/repositories/results/results.ts"
import { usePostListRankingRunnerManagement } from "../../../../../infrastructure/repositories/ranking-runner-management/ranking-runner-management.ts"
import { UPLOAD_TYPES } from "../../../../Results/pages/Results/shared/constants.ts"
import {
  findRunnerParticipant,
  organizerRankingStatus,
  organizerSearchText,
} from "./organizerRankingStatus.ts"

export interface OrganizerRankingContext {
  rankingId: string
  eventId: string
  stageId: string
  stageOrder?: number
}

export function useOrganizerRankingStatus(
  organizer: RankingOrganizer,
  { rankingId, eventId, stageId, stageOrder }: OrganizerRankingContext,
) {
  const notifyError = useNotifyError()
  const queryClient = useQueryClient()
  const runnerId = organizer.runner_id
  const searchParams = { text: organizerSearchText(organizer) }

  const results = useGetListResults(eventId, stageId, searchParams, {
    query: { enabled: Boolean(runnerId && searchParams.text) },
  })
  const addToRanking = usePostListRankingRunnerManagement()

  const participants = results.data?.data ?? []
  const participant = runnerId ? findRunnerParticipant(participants, runnerId) : undefined

  const status = organizerRankingStatus({
    runnerId,
    participants,
    isChecking: results.isLoading,
    stageOrder,
  })

  const add = async () => {
    if (!runnerId || stageOrder === undefined) return
    try {
      await addToRanking.mutateAsync({
        rankingID: rankingId,
        eventID: eventId,
        stageID: stageId,
        data: {
          upload_type: UPLOAD_TYPES.COMPUTABLE_ORG,
          runner_id: runnerId,
          stage_order: stageOrder,
        },
      })
      await queryClient.invalidateQueries(getGetListResultsQueryKey(eventId, stageId, searchParams))
    } catch (error) {
      notifyError(error)
    }
  }

  return {
    status,
    runnerClassName: participant?.class?.short_name ?? "",
    isAdding: addToRanking.isLoading,
    add,
  }
}
