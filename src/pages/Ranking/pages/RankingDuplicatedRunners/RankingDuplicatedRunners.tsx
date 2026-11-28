import { useParams } from "react-router-dom"
import { useTranslationRanking } from "../../shared/useTranslationRanking.ts"
import { useGetRankingSettings } from "../../../../infrastructure/repositories/ranking-settings/ranking-settings.ts"
import { rankingSettingsPath } from "../../../../shared/routes.ts"
import SettingsPageLayout from "../../components/SettingsPageLayout.tsx"
import DuplicatedRunnerPairList from "./components/DuplicatedRunnerPairList.tsx"

export default function RankingDuplicatedRunners() {
  const { t } = useTranslationRanking()
  const { rankingId } = useParams()
  const { data, isLoading } = useGetRankingSettings(rankingId ?? "")

  const ranking = data?.data
  const title = t("DuplicatedRunners.title")
  const rankingCrumb = {
    label: ranking?.title ?? rankingId ?? "",
    to: rankingSettingsPath(rankingId ?? ""),
  }

  return (
    <SettingsPageLayout
      heading={title}
      currentCrumb={title}
      parentCrumb={rankingCrumb}
      isLoading={isLoading}
      isMissing={!ranking}
    >
      {ranking && (
        <DuplicatedRunnerPairList eventId={ranking.event_id} stageId={ranking.stage_id} />
      )}
    </SettingsPageLayout>
  )
}
