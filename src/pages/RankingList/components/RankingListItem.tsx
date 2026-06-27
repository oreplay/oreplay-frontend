import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Ranking } from "../../../domain/types/v1api"
import { formatDate } from "../../../domain/formatDate.ts"
import SettingsIcon from "../../../components/icons/SettingsIcon.tsx"

interface RankingListItemProps {
  ranking: Ranking
}

export default function RankingListItem({ ranking }: RankingListItemProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const details = `${formatDate(ranking.created, i18n.language)} · ${t(
    "Ranking.Settings.maxPoints",
  )}: ${ranking.max_points} · ${ranking.id}`

  return (
    <li className="rk-ranking-list-item flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="font-medium">{ranking.title}</p>
        <p className="text-sm text-neutral-500">{details}</p>
      </div>
      <button
        type="button"
        aria-label={t("Ranking.List.editSettings")}
        onClick={() => void navigate(`${ranking.id}/settings`)}
        className="text-neutral-500 transition-colors hover:text-primary"
      >
        <SettingsIcon />
      </button>
    </li>
  )
}
