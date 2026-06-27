import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { Ranking } from "../../domain/types/v1api"
import {
  useGetRankingSettings,
  usePatchRankingSettings,
  usePostListRankingSettings,
} from "../../infrastructure/repositories/ranking-settings/ranking-settings.ts"
import {
  RankingSettingsFormState,
  initRankingSettingsForm,
  toRankingPatchBody,
  toRankingPostBody,
} from "../../domain/rankingSettingsForm.ts"
import SettingsPageLayout from "./components/SettingsPageLayout.tsx"
import RankingSettingsForm from "./components/RankingSettingsForm.tsx"

export default function RankingDuplicate() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { rankingId } = useParams()
  const { data, isLoading } = useGetRankingSettings(rankingId ?? "")
  const createRanking = usePostListRankingSettings()
  const patchRanking = usePatchRankingSettings()

  const ranking = data?.data
  const isSubmitting = createRanking.isLoading || patchRanking.isLoading

  // The POST schema can't carry the title/nc/status/overall, so duplicate is a
  // two-step: create the ranking, then PATCH the full settings onto it.
  const duplicate = async (
    source: Ranking,
    state: RankingSettingsFormState,
  ) => {
    try {
      const created = await createRanking.mutateAsync({
        data: toRankingPostBody(source, state),
      })
      const newId = created.data.id
      await patchRanking.mutateAsync({
        rankingID: newId,
        data: toRankingPatchBody({ ...source, id: newId }, state),
      })
      void navigate(`/ranking/${newId}/settings`)
    } catch {
      // The failure is tracked by react-query's mutation error state; we just
      // avoid navigating. (Surface it with a toast when we add save feedback.)
    }
  }

  return (
    <SettingsPageLayout
      heading={t("Ranking.Duplicate.title")}
      currentCrumb={t("Ranking.Duplicate.crumb")}
      isLoading={isLoading}
      isMissing={!ranking}
    >
      {ranking && (
        <RankingSettingsForm
          initialState={{ ...initRankingSettingsForm(ranking), title: "" }}
          eventId={ranking.event_id}
          stageId={ranking.stage_id}
          submitLabel={t("Ranking.gui.duplicate")}
          isSubmitting={isSubmitting}
          onSubmit={(state) => void duplicate(ranking, state)}
        />
      )}
    </SettingsPageLayout>
  )
}
