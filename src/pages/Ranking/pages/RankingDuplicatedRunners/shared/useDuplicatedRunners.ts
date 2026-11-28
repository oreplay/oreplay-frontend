import { useMutation, useQueryClient } from "react-query"
import { useNotifyError } from "../../../../../infrastructure/notifications/useNotifyError.ts"
import { orvalAxiosInstance } from "../../../../../infrastructure/orval/orval-axios-instance.ts"
import {
  getGetListResultsQueryKey,
  useGetListResults,
} from "../../../../../infrastructure/repositories/results/results.ts"
import {
  DUPLICATED_RUNNERS_OUTPUT,
  DuplicatedRunner,
  pairDuplicatedRunners,
  readDuplicatedRunners,
  removalRequestPath,
} from "./duplicatedRunners.ts"

const DUPLICATED_RUNNERS_PARAMS = { output: DUPLICATED_RUNNERS_OUTPUT }

export function useDuplicatedRunners(eventId: string, stageId: string) {
  const notifyError = useNotifyError()
  const queryClient = useQueryClient()

  const query = useGetListResults(eventId, stageId, DUPLICATED_RUNNERS_PARAMS, {
    query: { enabled: Boolean(eventId && stageId) },
  })
  const removal = useMutation((runner: DuplicatedRunner) =>
    orvalAxiosInstance<unknown>({ url: removalRequestPath(runner.invalidate_link), method: "GET" }),
  )

  const remove = async (runner: DuplicatedRunner): Promise<boolean> => {
    try {
      await removal.mutateAsync(runner)
      await queryClient.invalidateQueries(
        getGetListResultsQueryKey(eventId, stageId, DUPLICATED_RUNNERS_PARAMS),
      )
      return true
    } catch (error) {
      notifyError(error)
      return false
    }
  }

  return {
    pairs: pairDuplicatedRunners(readDuplicatedRunners(query.data)),
    isLoading: query.isLoading,
    isError: query.isError,
    remove,
  }
}
