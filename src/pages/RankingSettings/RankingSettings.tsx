import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { useGetRankingSettings } from "../../infrastructure/repositories/ranking-settings/ranking-settings.ts"
import ArrowBackIcon from "../../components/icons/ArrowBackIcon.tsx"
import Spinner from "../../components/Spinner/Spinner.tsx"
import RankingSettingsForm from "./components/RankingSettingsForm.tsx"

export default function RankingSettings() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { rankingId } = useParams()
  const { data, isLoading } = useGetRankingSettings(rankingId ?? "")

  const ranking = data?.data

  return (
    <div className="rk-ranking-settings min-h-screen grow bg-surface py-12">
      <div className="mx-auto max-w-xl px-4">
        <button
          type="button"
          onClick={() => void navigate("/ranking")}
          className="mb-4 inline-flex items-center gap-1 text-primary"
        >
          <ArrowBackIcon />
          {t("Ranking.Settings.back")}
        </button>
        <h1 className="mb-4 text-2xl font-semibold">
          {t("Ranking.Settings.title")}
        </h1>

        {isLoading ? (
          <Spinner label={t("Ranking.loading")} />
        ) : ranking ? (
          <RankingSettingsForm ranking={ranking} />
        ) : (
          <p className="text-neutral-500">{t("Ranking.Settings.notFound")}</p>
        )}
      </div>
    </div>
  )
}
