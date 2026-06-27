import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import {
  useGetRankingSettings,
  usePatchRankingSettings,
} from "../../infrastructure/repositories/ranking-settings/ranking-settings.ts"
import {
  initRankingSettingsForm,
  toRankingPatchBody,
} from "../../domain/rankingSettingsForm.ts"
import SettingsPageLayout from "./components/SettingsPageLayout.tsx"
import RankingSettingsForm from "./components/RankingSettingsForm.tsx"

export default function RankingSettings() {
  const { t } = useTranslation()
  const { rankingId } = useParams()
  const { data, isLoading } = useGetRankingSettings(rankingId ?? "")
  const { mutate, isLoading: isSaving } = usePatchRankingSettings()

  const ranking = data?.data

  return (
    <SettingsPageLayout
      heading={t("Ranking.Settings.title")}
      currentCrumb={ranking?.title ?? rankingId ?? ""}
      isLoading={isLoading}
      isMissing={!ranking}
    >
      {ranking && (
        <RankingSettingsForm
          initialState={initRankingSettingsForm(ranking)}
          eventId={ranking.event_id}
          stageId={ranking.stage_id}
          submitLabel={t("Ranking.gui.save")}
          isSubmitting={isSaving}
          onSubmit={(state) =>
            mutate({
              rankingID: ranking.id,
              data: toRankingPatchBody(ranking, state),
            })
          }
        />
      )}
    </SettingsPageLayout>
  )
}
