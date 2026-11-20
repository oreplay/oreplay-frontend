import { useGetRankingSettings } from "../../../../../../../infrastructure/repositories/ranking-settings/ranking-settings.ts"
import { useGetListStageClasses } from "../../../../../../../infrastructure/repositories/stage-classes/stage-classes.ts"
import { useGetListResults } from "../../../../../../../infrastructure/repositories/results/results.ts"
import {
  ProcessResultsWarning,
  rankingClassWarnings,
  runnersWithoutResultWarnings,
} from "./processResultsWarnings.ts"

interface ProcessResultsWarningsResult {
  warnings: ProcessResultsWarning[]
  isLoading: boolean
}

/** Compares the ranking definition with the classes of the stage to process. */
export function useProcessResultsWarnings(
  rankingId: string,
  eventId: string,
  stageId: string,
): ProcessResultsWarningsResult {
  const ranking = useGetRankingSettings(rankingId)
  const classes = useGetListStageClasses(eventId, stageId)
  const results = useGetListResults(eventId, stageId)

  const includedClassNames = ranking.data?.data?.included_class_names ?? []
  const eventClassNames = (classes.data?.data ?? []).map((eventClass) => eventClass.short_name)

  return {
    warnings: [
      ...rankingClassWarnings(includedClassNames, eventClassNames),
      ...runnersWithoutResultWarnings(results.data?.data ?? []),
    ],
    isLoading: ranking.isLoading || classes.isLoading || results.isLoading,
  }
}
