import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import {
  useGetRankingSettings,
  usePatchRankingSettings,
} from "../../../../infrastructure/repositories/ranking-settings/ranking-settings.ts"
import { initRankingSettingsForm, toRankingBody } from "../../shared/rankingSettingsForm.ts"
import { useNotifyError } from "../../../../infrastructure/notifications/useNotifyError.ts"
import SettingsPageLayout from "../../components/SettingsPageLayout.tsx"
import RankingSettingsForm from "../../components/RankingSettingsForm.tsx"
import DeleteRankingButton from "./components/DeleteRankingButton.tsx"
import RunnerInteractionCard from "./components/RunnerInteractionCard.tsx"

export default function RankingSettings() {
  const { t } = useTranslation()
  const notifyError = useNotifyError()
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
      extraContent={ranking ? <RunnerInteractionCard rankingId={ranking.id} /> : undefined}
    >
      {ranking && (
        <RankingSettingsForm
          initialState={initRankingSettingsForm(ranking)}
          eventId={ranking.event_id}
          stageId={ranking.stage_id}
          submitLabel={t("common:save")}
          isSubmitting={isSaving}
          onSubmit={(state) =>
            mutate(
              {
                rankingID: ranking.id,
                data: toRankingBody(ranking, state, ranking.id),
              },
              {
                onError: (error) => notifyError(error),
              },
            )
          }
          secondaryAction={
            <DeleteRankingButton rankingId={ranking.id} eventId={ranking.event_id} />
          }
        />
      )}
    </SettingsPageLayout>
  )
}
