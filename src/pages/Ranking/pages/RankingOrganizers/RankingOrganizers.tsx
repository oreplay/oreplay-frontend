import { Link, useParams } from "react-router-dom"
import { useTranslationRanking } from "../../shared/useTranslationRanking.ts"
import { rankingSettingsPath } from "../../../../shared/routes.ts"
import SettingsPageLayout from "../../components/SettingsPageLayout.tsx"
import RankingOrganizerForm from "./components/RankingOrganizerForm.tsx"
import RankingOrganizerList from "./components/RankingOrganizerList.tsx"
import { useRankingOrganizers } from "./shared/useRankingOrganizers.ts"
import { useStageOrderBreadcrumb } from "./shared/useStageOrderBreadcrumb.ts"

export default function RankingOrganizers() {
  const { t } = useTranslationRanking()
  const { rankingId, eventId, stageId, stageOrderId } = useParams()
  const params = { rankingId, eventId, stageId, stageOrderId }
  const organizers = useRankingOrganizers(params)
  const { rankingCrumb, stageOrderLabel } = useStageOrderBreadcrumb(params)

  return (
    <SettingsPageLayout
      heading={t("RankingOrganizers.title")}
      currentCrumb={stageOrderLabel}
      parentCrumb={rankingCrumb}
      isLoading={false}
      isMissing={false}
    >
      <div className="rk-ranking-organizers flex flex-col gap-6">
        <Link
          to={rankingSettingsPath(organizers.rankingId)}
          className="self-start text-sm text-primary hover:underline"
        >
          {t("RankingOrganizers.backToSettings")}
        </Link>
        <RankingOrganizerList
          organizers={organizers.organizers}
          isLoading={organizers.isLoading}
          isError={organizers.isError}
          isRemoving={organizers.isRemoving}
          onRemove={organizers.removeOrganizer}
        />
        <RankingOrganizerForm isSubmitting={organizers.isAdding} onSubmit={organizers.add} />
      </div>
    </SettingsPageLayout>
  )
}
