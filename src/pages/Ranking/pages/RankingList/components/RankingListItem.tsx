import { useState } from "react"
import { useTranslationRanking } from "../../../shared/useTranslationRanking.ts"
import { useNavigate } from "react-router-dom"
import { Ranking } from "../../../../../domain/types/v1api"
import { competitionResultsPath } from "../../../shared/competitionLink.ts"
import { formatDate } from "../shared/formatDate.ts"
import DropdownMenu, { DropdownMenuItem } from "./DropdownMenu/DropdownMenu.tsx"
import SettingsIcon from "./icons/SettingsIcon.tsx"
import ProcessEventDialog from "./ProcessEventDialog.tsx"

interface RankingListItemProps {
  ranking: Ranking
}

export default function RankingListItem({ ranking }: RankingListItemProps) {
  const { t, i18n } = useTranslationRanking()
  const navigate = useNavigate()
  const [processOpen, setProcessOpen] = useState(false)

  const settingsPath = `${ranking.id}/settings`
  const details = `${formatDate(ranking.created, i18n.language)} · ${t(
    "Settings.maxPoints",
  )}: ${ranking.max_points} · ${ranking.id}`

  const menuItems: DropdownMenuItem[] = [
    {
      label: t("common:edit"),
      onSelect: () => void navigate(settingsPath),
    },
    {
      label: t("Settings.competitionLink"),
      href: competitionResultsPath(ranking.event_id, ranking.stage_id),
    },
    {
      label: t("common:duplicate"),
      onSelect: () => void navigate(`${ranking.id}/duplicate`),
    },
    {
      label: t("ProcessEvent.title"),
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
        triggerLabel={t("List.menuLabel")}
        trigger={<SettingsIcon />}
        items={menuItems}
      />
      <ProcessEventDialog
        open={processOpen}
        onClose={() => setProcessOpen(false)}
        rankingId={ranking.id}
      />
    </li>
  )
}
