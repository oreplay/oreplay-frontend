import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Ranking } from "../../../domain/types/v1api"
import { competitionResultsPath } from "../../../domain/competitionLink.ts"
import { formatDate } from "../../../domain/formatDate.ts"
import DropdownMenu, {
  DropdownMenuItem,
} from "../../../components/DropdownMenu/DropdownMenu.tsx"
import SettingsIcon from "../../../components/icons/SettingsIcon.tsx"
import ProcessEventDialog from "./ProcessEventDialog.tsx"

interface RankingListItemProps {
  ranking: Ranking
}

export default function RankingListItem({ ranking }: RankingListItemProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [processOpen, setProcessOpen] = useState(false)

  const settingsPath = `${ranking.id}/settings`
  const details = `${formatDate(ranking.created, i18n.language)} · ${t(
    "Ranking.Settings.maxPoints",
  )}: ${ranking.max_points} · ${ranking.id}`

  const menuItems: DropdownMenuItem[] = [
    {
      label: t("Ranking.gui.edit"),
      onSelect: () => void navigate(settingsPath),
    },
    {
      label: t("Ranking.Settings.competitionLink"),
      href: competitionResultsPath(ranking.event_id, ranking.stage_id),
    },
    {
      label: t("Ranking.gui.duplicate"),
      onSelect: () => void navigate(`${ranking.id}/duplicate`),
    },
    {
      label: t("Ranking.ProcessEvent.title"),
      onSelect: () => setProcessOpen(true),
    },
  ]

  return (
    <li
      onClick={() => void navigate(settingsPath)}
      className="rk-ranking-list-item flex cursor-pointer items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm transition-colors hover:bg-neutral-50"
    >
      <div>
        <p className="font-medium">{ranking.title}</p>
        <p className="text-sm text-neutral-500">{details}</p>
      </div>
      <DropdownMenu
        triggerLabel={t("Ranking.List.menuLabel")}
        trigger={<SettingsIcon />}
        items={menuItems}
      />
      <ProcessEventDialog
        open={processOpen}
        onClose={() => setProcessOpen(false)}
      />
    </li>
  )
}
