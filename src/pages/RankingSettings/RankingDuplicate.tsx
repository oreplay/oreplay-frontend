import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { Ranking } from "../../domain/types/v1api"
import { useGetRankingSettings } from "../../infrastructure/repositories/ranking-settings/ranking-settings.ts"
import {
  RankingSettingsFormState,
  initRankingSettingsForm,
} from "../../domain/rankingSettingsForm.ts"
import { notifyError } from "../../infrastructure/notifications/notifications.ts"
import { httpErrorMessageKey } from "../../infrastructure/notifications/httpError.ts"
import { useDuplicateRanking } from "./useDuplicateRanking.ts"
import SettingsPageLayout from "./components/SettingsPageLayout.tsx"
import RankingSettingsForm from "./components/RankingSettingsForm.tsx"

export default function RankingDuplicate() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { rankingId } = useParams()
  const { data, isLoading } = useGetRankingSettings(rankingId ?? "")
  const { duplicate, isLoading: isDuplicating } = useDuplicateRanking()

  const ranking = data?.data

  const onDuplicate = async (
    source: Ranking,
    state: RankingSettingsFormState,
  ) => {
    try {
      const newId = await duplicate(source, state)
      void navigate(`/ranking/${newId}/settings`)
    } catch (error) {
      notifyError(t(httpErrorMessageKey(error)))
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
          isSubmitting={isDuplicating}
          onSubmit={(state) => void onDuplicate(ranking, state)}
        />
      )}
    </SettingsPageLayout>
  )
}
