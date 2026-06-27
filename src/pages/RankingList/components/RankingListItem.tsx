import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Ranking } from "../../../domain/types/v1api"
import SettingsIcon from "../../../components/icons/SettingsIcon.tsx"

interface RankingListItemProps {
  ranking: Ranking
}

export default function RankingListItem({ ranking }: RankingListItemProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const details = `${t("Ranking.List.scoringAlgorithm")}: ${ranking.scoring_algorithm} · ${t(
    "Ranking.List.maxPoints",
  )}: ${ranking.max_points}`

  return (
    <li className="rk-ranking-list-item flex items-center justify-between rounded border border-neutral-200 bg-white px-4 py-3">
      <div>
        <p className="font-medium">{ranking.id}</p>
        <p className="text-sm text-neutral-500">{details}</p>
      </div>
      <button
        type="button"
        aria-label={t("Ranking.List.editSettings")}
        onClick={() => void navigate(`${ranking.id}/settings`)}
        className="rounded-full p-2 text-neutral-600 hover:bg-neutral-100"
      >
        <SettingsIcon />
      </button>
    </li>
  )
}
