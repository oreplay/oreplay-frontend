import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { useGetRankingSettings } from "../../infrastructure/repositories/ranking-settings/ranking-settings.ts"
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs.tsx"
import Spinner from "../../components/Spinner/Spinner.tsx"
import { buildRankingSettingsBreadcrumbs } from "../../domain/breadcrumbs.ts"
import RankingSettingsForm from "./components/RankingSettingsForm.tsx"

export default function RankingSettings() {
  const { t } = useTranslation()
  const { rankingId } = useParams()
  const { data, isLoading } = useGetRankingSettings(rankingId ?? "")

  const ranking = data?.data

  const breadcrumbs = buildRankingSettingsBreadcrumbs(
    {
      dashboard: t("Ranking.Breadcrumbs.dashboard"),
      ranking: t("Ranking.Breadcrumbs.rankings"),
    },
    ranking?.title ?? rankingId ?? "",
  )

  return (
    <div className="rk-ranking-settings min-h-screen grow bg-surface py-12">
      <div className="mx-auto max-w-3xl px-4">
        <Breadcrumbs
          items={breadcrumbs}
          label={t("Ranking.Breadcrumbs.label")}
          className="mb-6"
        />
        <h1 className="mb-4 text-2xl font-semibold">
          {t("Ranking.Settings.title")}
        </h1>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          {isLoading ? (
            <Spinner label={t("Ranking.gui.loading")} />
          ) : ranking ? (
            <RankingSettingsForm ranking={ranking} />
          ) : (
            <p className="text-neutral-500">{t("Ranking.Settings.notFound")}</p>
          )}
        </div>
      </div>
    </div>
  )
}
