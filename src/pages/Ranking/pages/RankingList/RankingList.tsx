import { useTranslationRanking } from "../../shared/useTranslationRanking.ts"
import { useGetListRankingSettings } from "../../../../infrastructure/repositories/ranking-settings/ranking-settings.ts"
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs.tsx"
import { buildRankingListBreadcrumbs } from "../../shared/breadcrumbs.ts"
import RankingListContent from "./components/RankingListContent.tsx"

export default function RankingList() {
  const { t } = useTranslationRanking()
  const { data, isLoading, isError } = useGetListRankingSettings()

  const breadcrumbs = buildRankingListBreadcrumbs({
    dashboard: t("translation:Dashboard.Dashboard"),
    ranking: t("Breadcrumbs.rankings"),
  })

  return (
    <div className="rk-ranking-list min-h-screen grow bg-surface py-12">
      <div className="mx-auto max-w-3xl px-4">
        <Breadcrumbs items={breadcrumbs} label={t("Breadcrumbs.label")} className="mb-6" />
        <h1 className="mb-2 text-2xl font-semibold">{t("List.title")}</h1>
        <p className="mb-8 text-sm text-neutral-500">{t("List.description")}</p>
        <RankingListContent isError={isError} isLoading={isLoading} rankings={data?.data ?? []} />
      </div>
    </div>
  )
}
