import { useTranslationRanking } from "../../../shared/useTranslationRanking.ts"
import { RankingOrganizer } from "../../../../../domain/types/v1api"
import { formatOrganizerName } from "../shared/formatOrganizerName.ts"

interface RankingOrganizerListItemProps {
  organizer: RankingOrganizer
  onRemove: () => void
}

export default function RankingOrganizerListItem({
  organizer,
  onRemove,
}: RankingOrganizerListItemProps) {
  const { t } = useTranslationRanking()

  return (
    <li className="rk-ranking-organizer-list-item flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="m-0 font-medium">
          {formatOrganizerName(organizer.first_name, organizer.last_name)}
        </p>
        {organizer.description && (
          <p className="m-0 text-sm text-neutral-500">{organizer.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="text-sm font-medium text-red-600 hover:underline"
      >
        {t("common:delete")}
      </button>
    </li>
  )
}
