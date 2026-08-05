import { RankingSettingsFormState, toRankingBody } from "./rankingSettingsForm.ts"
import {
  RANKING_STAGE_DESCRIPTION,
  RANKING_TOTALS_STAGE_TYPE_ID,
  buildRankingEventBody,
} from "./rankingCreation.ts"
import { usePostListRankingSettings } from "../../../infrastructure/repositories/ranking-settings/ranking-settings.ts"
import { usePostListEvents } from "../../../infrastructure/repositories/events/events.ts"
import { usePostListStages } from "../../../infrastructure/repositories/stages/stages.ts"

export function useRankingCreator() {
  const createRanking = usePostListRankingSettings()
  const createEvent = usePostListEvents()
  const createStage = usePostListStages()

  const isLoading = createRanking.isLoading || createEvent.isLoading || createStage.isLoading

  const create = async (
    state: RankingSettingsFormState,
    excludedClassNames: string,
  ): Promise<string> => {
    const event = await createEvent.mutateAsync({
      data: buildRankingEventBody(state.title),
    })
    const eventId = event.data.id

    const stage = await createStage.mutateAsync({
      eventID: eventId,
      data: {
        description: RANKING_STAGE_DESCRIPTION,
        stage_type_id: RANKING_TOTALS_STAGE_TYPE_ID,
      },
    })
    const stageId = stage.data.id

    const ranking = await createRanking.mutateAsync({
      data: toRankingBody(
        { event_id: eventId, stage_id: stageId, excluded_class_names: excludedClassNames },
        state,
      ),
    })

    return ranking.data.id
  }

  return { create, isLoading }
}
