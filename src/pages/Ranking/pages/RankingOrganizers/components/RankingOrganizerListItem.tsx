import { useTranslationRanking } from "../../../shared/useTranslationRanking.ts"
import { PostListRankingOrganizersBody, RankingOrganizer } from "../../../../../domain/types/v1api"
import { formatOrganizerName } from "../shared/formatOrganizerName.ts"
import {
  OrganizerRankingContext,
  useOrganizerRankingStatus,
} from "../shared/useOrganizerRankingStatus.ts"
import { isOrganizerRemovable } from "../shared/organizerRankingStatus.ts"
import { needsRunnerMatches } from "../shared/organizerRunnerMatches.ts"
import { useOrganizerRunnerMatches } from "../shared/useOrganizerRunnerMatches.ts"
import OrganizerRankingStatus from "./OrganizerRankingStatus/OrganizerRankingStatus.tsx"
import OrganizerRunnerMatches from "./OrganizerRunnerMatches/OrganizerRunnerMatches.tsx"

interface RankingOrganizerListItemProps {
  organizer: RankingOrganizer
  rankingContext: OrganizerRankingContext
  onRemove: () => void
  onReplace: (replacement: PostListRankingOrganizersBody) => Promise<boolean>
}

export default function RankingOrganizerListItem({
  organizer,
  rankingContext,
  onRemove,
  onReplace,
}: RankingOrganizerListItemProps) {
  const { t } = useTranslationRanking()
  const { status, runnerClassName, isAdding, add } = useOrganizerRankingStatus(
    organizer,
    rankingContext,
  )
  const runnerMatches = useOrganizerRunnerMatches(organizer, rankingContext, {
    enabled: needsRunnerMatches(status),
    onReplace,
  })

  return (
    <li className="rk-ranking-organizer-list-item flex flex-col gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-4">
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
      </div>
      <OrganizerRunnerMatches
        matches={runnerMatches.matches}
        isSearching={runnerMatches.isSearching}
        addingRunnerId={runnerMatches.addingRunnerId}
        onAdd={(runner) => void runnerMatches.add(runner)}
      />
    </li>
  )
}
