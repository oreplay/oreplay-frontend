import { useState } from "react"
import { useQueryClient } from "react-query"
import {
  PostListRankingOrganizersBody,
  RankingOrganizer,
  RunnerSearch,
} from "../../../../../domain/types/v1api"
import { useNotifyError } from "../../../../../infrastructure/notifications/useNotifyError.ts"
import { getGetListResultsQueryKey } from "../../../../../infrastructure/repositories/results/results.ts"
import { useGetListRunnerSearch } from "../../../../../infrastructure/repositories/runner-search/runner-search.ts"
import { usePostListRankingRunnerManagement } from "../../../../../infrastructure/repositories/ranking-runner-management/ranking-runner-management.ts"
import { UPLOAD_TYPES } from "../../../../Results/pages/Results/shared/constants.ts"
import { formatOrganizerName } from "./formatOrganizerName.ts"
import { toReplacementOrganizerBody } from "./organizerRunnerMatches.ts"
import { OrganizerRankingContext } from "./useOrganizerRankingStatus.ts"

interface OrganizerRunnerMatchesOptions {
  enabled: boolean
  onReplace: (replacement: PostListRankingOrganizersBody) => Promise<boolean>
}

export function useOrganizerRunnerMatches(
  organizer: RankingOrganizer,
  { rankingId, eventId, stageId, stageOrder }: OrganizerRankingContext,
  { enabled, onReplace }: OrganizerRunnerMatchesOptions,
) {
  const notifyError = useNotifyError()
  const queryClient = useQueryClient()
  const [addingRunnerId, setAddingRunnerId] = useState<string | null>(null)
  const text = formatOrganizerName(organizer.first_name, organizer.last_name)
  const searchEnabled = enabled && Boolean(text)

  const search = useGetListRunnerSearch(
    { text, event_id: eventId || undefined },
    { query: { enabled: searchEnabled } },
  )
  const addToRanking = usePostListRankingRunnerManagement()

  const add = async (runner: RunnerSearch) => {
    if (stageOrder === undefined) return
    setAddingRunnerId(runner.id)
    try {
      await addToRanking.mutateAsync({
        rankingID: rankingId,
        eventID: eventId,
        stageID: stageId,
        data: {
          upload_type: UPLOAD_TYPES.COMPUTABLE_ORG,
          runner_id: runner.id,
          stage_order: stageOrder,
        },
      })
      await queryClient.invalidateQueries(getGetListResultsQueryKey(eventId, stageId))
      await onReplace(toReplacementOrganizerBody(organizer, runner))
    } catch (error) {
      notifyError(error)
    } finally {
      setAddingRunnerId(null)
    }
  }

  return {
    matches: searchEnabled ? (search.data?.data ?? []) : [],
    isSearching: searchEnabled && search.isLoading,
    addingRunnerId,
    add,
  }
}
