import { useParams } from "react-router-dom"
import { useTranslationRanking } from "../../shared/useTranslationRanking.ts"
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
  const { rankingCrumb, stageOrderLabel, stageOrderNumber } = useStageOrderBreadcrumb(params)
  const rankingContext = {
    rankingId: rankingId ?? "",
    eventId: eventId ?? "",
    stageId: stageId ?? "",
    stageOrder: stageOrderNumber,
  }

  return (
    <SettingsPageLayout
      heading={t("RankingOrganizers.title")}
      currentCrumb={stageOrderLabel}
      parentCrumb={rankingCrumb}
      isLoading={false}
      isMissing={false}
      extraContent={
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <RankingOrganizerForm
            eventId={eventId ?? ""}
            isSubmitting={organizers.isAdding}
            onSubmit={organizers.add}
          />
        </div>
      }
    >
      <RankingOrganizerList
        organizers={organizers.organizers}
        rankingContext={rankingContext}
        isLoading={organizers.isLoading}
        isError={organizers.isError}
        isRemoving={organizers.isRemoving}
        onRemove={organizers.removeOrganizer}
      />
    </SettingsPageLayout>
  )
}
