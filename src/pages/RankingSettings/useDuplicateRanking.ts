import { Ranking } from "../../domain/types/v1api"
import {
  RankingSettingsFormState,
  toRankingBody,
} from "../../domain/rankingSettingsForm.ts"
import {
  EVENT_NOT_PUBLIC,
  RANKING_STAGE_DESCRIPTION,
  RANKING_TOTALS_STAGE_TYPE_ID,
  buildDuplicateEventBody,
} from "../../domain/duplicateRanking.ts"
import {
  usePatchRankingSettings,
  usePostListRankingSettings,
} from "../../infrastructure/repositories/ranking-settings/ranking-settings.ts"
import {
  usePatchEvents,
  usePostListEvents,
} from "../../infrastructure/repositories/events/events.ts"
import { usePostListStages } from "../../infrastructure/repositories/stages/stages.ts"

// Duplicating a ranking also provisions its own non-public event and a "Ranking"
// stage, then points the new ranking at them. Steps run in sequence; a failure
// rejects (no rollback of earlier steps) so the caller can surface it.
export function useDuplicateRanking() {
  const createRanking = usePostListRankingSettings()
  const patchRanking = usePatchRankingSettings()
  const createEvent = usePostListEvents()
  const patchEvent = usePatchEvents()
  const createStage = usePostListStages()

  const isLoading =
    createRanking.isLoading ||
    patchRanking.isLoading ||
    createEvent.isLoading ||
    patchEvent.isLoading ||
    createStage.isLoading

  const duplicate = async (
    source: Ranking,
    state: RankingSettingsFormState,
  ): Promise<string> => {
    const ranking = await createRanking.mutateAsync({
      data: toRankingBody(source, state),
    })
    const rankingId = ranking.data.id

    const event = await createEvent.mutateAsync({
      data: buildDuplicateEventBody(state.title),
    })
    const eventId = event.data.id
    await patchEvent.mutateAsync({
      eventID: eventId,
      data: { is_hidden: EVENT_NOT_PUBLIC },
    })

    const stage = await createStage.mutateAsync({
      eventID: eventId,
      data: {
        description: RANKING_STAGE_DESCRIPTION,
        stage_type_id: RANKING_TOTALS_STAGE_TYPE_ID,
      },
    })
    const stageId = stage.data.id

    await patchRanking.mutateAsync({
      rankingID: rankingId,
      data: toRankingBody(
        { ...source, event_id: eventId, stage_id: stageId },
        state,
        rankingId,
      ),
    })

    return rankingId
  }

  return { duplicate, isLoading }
}
