import { useTranslationRanking } from "../../../shared/useTranslationRanking.ts"
import { RankingOrganizer } from "../../../../../domain/types/v1api"
import { formatOrganizerName } from "../shared/formatOrganizerName.ts"
import {
  OrganizerRankingContext,
  useOrganizerRankingStatus,
} from "../shared/useOrganizerRankingStatus.ts"
import { isOrganizerRemovable } from "../shared/organizerRankingStatus.ts"
import OrganizerRankingStatus from "./OrganizerRankingStatus/OrganizerRankingStatus.tsx"

interface RankingOrganizerListItemProps {
  organizer: RankingOrganizer
  rankingContext: OrganizerRankingContext
  onRemove: () => void
}

export default function RankingOrganizerListItem({
  organizer,
  rankingContext,
  onRemove,
}: RankingOrganizerListItemProps) {
  const { t } = useTranslationRanking()
  const { status, runnerClassName, isAdding, add } = useOrganizerRankingStatus(
    organizer,
    rankingContext,
  )

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
      <div className="flex shrink-0 items-center gap-4">
        <OrganizerRankingStatus
          status={status}
          runnerClassName={runnerClassName}
          isAdding={isAdding}
          onAdd={() => void add()}
        />
        {isOrganizerRemovable(status) && (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            {t("common:delete")}
          </button>
        )}
      </div>
    </li>
  )
}
