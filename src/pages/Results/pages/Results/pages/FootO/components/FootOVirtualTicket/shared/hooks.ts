import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { useQuery } from "react-query"
import { getFootORunnersByClass } from "../../../services/FootOService.ts"
import { useParams } from "react-router-dom"

export function useFillClubRunner(
  clubRunner: ProcessedRunnerModel | null,
  enabled: boolean = true,
): { runner: ProcessedRunnerModel | null; isLoading: boolean; isError: boolean } {
  const { eventId, stageId } = useParams()
  if (!eventId || !stageId) throw new Error("Missing event or stage ID")

  const { data, isLoading, isError } = useQuery<ProcessedRunnerModel[]>(
    [eventId, stageId, "results", "classes", clubRunner?.class.id],
    () => getFootORunnersByClass(eventId, stageId, clubRunner!.class.id),
    {
      enabled: enabled && !!clubRunner,
      refetchOnWindowFocus: false,
      staleTime: 60000,
    },
  )
  //console.log("enabled", enabled, "clubRunner", clubRunner, "data", data)
  const runner =
    !enabled || !clubRunner || !data
      ? clubRunner
      : (data.find((r) => r.id === clubRunner.id) ?? clubRunner)

  return { runner, isLoading, isError }
}
