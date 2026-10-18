import { useTranslationRanking } from "../../../../shared/useTranslationRanking.ts"
import { RunnerSearch } from "../../../../../../domain/types/v1api"
import SpinnerRing from "../../../../components/SpinnerRing.tsx"
import OrganizerRunnerMatch from "./components/OrganizerRunnerMatch.tsx"

interface OrganizerRunnerMatchesProps {
  matches: RunnerSearch[]
  isSearching: boolean
  addingRunnerId: string | null
  onAdd: (runner: RunnerSearch) => void
}

export default function OrganizerRunnerMatches({
  matches,
  isSearching,
  addingRunnerId,
  onAdd,
}: OrganizerRunnerMatchesProps) {
  const { t } = useTranslationRanking()
  const isAnyAdding = addingRunnerId !== null

  if (isSearching) {
    return (
      <span role="status" className="rk-organizer-runner-matches inline-flex">
        <SpinnerRing className="h-4 w-4 border-2 border-neutral-400" />
        <span className="sr-only">{t("common:loading")}</span>
      </span>
    )
  }

  if (matches.length === 0) {
    return null
  }

  return (
    <div className="rk-organizer-runner-matches flex flex-col gap-2 border-t border-neutral-100 pt-3">
      <p className="m-0 text-xs font-medium uppercase text-neutral-500">
        {t("RankingOrganizers.possibleMatches")}
      </p>
      <ul
        aria-label={t("RankingOrganizers.possibleMatches")}
        className="m-0 flex list-none flex-col gap-2 p-0"
      >
        {matches.map((runner) => (
          <OrganizerRunnerMatch
            key={runner.id}
            runner={runner}
            isAdding={addingRunnerId === runner.id}
            disabled={isAnyAdding}
            onAdd={() => onAdd(runner)}
          />
        ))}
      </ul>
    </div>
  )
}
