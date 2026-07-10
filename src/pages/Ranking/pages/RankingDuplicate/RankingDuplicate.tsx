import { useTranslationRanking } from "../../shared/useTranslationRanking.ts"
import { useNavigate, useParams } from "react-router-dom"
import { Ranking } from "../../../../domain/types/v1api"
import { useGetRankingSettings } from "../../../../infrastructure/repositories/ranking-settings/ranking-settings.ts"
import {
  RankingSettingsFormState,
  initRankingSettingsForm,
} from "../../shared/rankingSettingsForm.ts"
import { useNotifyError } from "../../../../infrastructure/notifications/useNotifyError.ts"
import { useDuplicateRanking } from "./shared/useDuplicateRanking.ts"
import SettingsPageLayout from "../../components/SettingsPageLayout.tsx"
import RankingSettingsForm from "../../components/RankingSettingsForm.tsx"

export default function RankingDuplicate() {
  const { t } = useTranslationRanking()
  const notifyError = useNotifyError()
  const navigate = useNavigate()
  const { rankingId } = useParams()
  const { data, isLoading } = useGetRankingSettings(rankingId ?? "")
  const { duplicate, isLoading: isDuplicating } = useDuplicateRanking()

  const ranking = data?.data

  const onDuplicate = async (source: Ranking, state: RankingSettingsFormState) => {
    try {
      const newId = await duplicate(source, state)
      void navigate(`/rankings/${newId}/settings`)
    } catch (error) {
      notifyError(error)
    }
  }

  return (
    <SettingsPageLayout
      heading={t("Duplicate.title")}
      currentCrumb={t("Duplicate.crumb")}
      isLoading={isLoading}
      isMissing={!ranking}
    >
      {ranking && (
        <RankingSettingsForm
          initialState={{ ...initRankingSettingsForm(ranking), title: "" }}
          eventId={ranking.event_id}
          stageId={ranking.stage_id}
          submitLabel={t("common:duplicate")}
          isSubmitting={isDuplicating}
          onSubmit={(state) => void onDuplicate(ranking, state)}
        />
      )}
    </SettingsPageLayout>
  )
}
