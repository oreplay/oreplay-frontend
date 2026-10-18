import { useTranslationRanking } from "../../../../../shared/useTranslationRanking.ts"
import { RunnerSearch } from "../../../../../../../domain/types/v1api"
import PrimaryButton from "../../../../../components/PrimaryButton.tsx"
import { formatOrganizerName } from "../../../shared/formatOrganizerName.ts"

interface OrganizerRunnerMatchProps {
  runner: RunnerSearch
  isAdding: boolean
  disabled: boolean
  onAdd: () => void
}

export default function OrganizerRunnerMatch({
  runner,
  isAdding,
  disabled,
  onAdd,
}: OrganizerRunnerMatchProps) {
  const { t } = useTranslationRanking()
  const className = runner.class?.short_name ?? ""

  return (
    <li className="rk-organizer-runner-match flex items-center justify-between gap-4">
      <span className="text-sm">{formatOrganizerName(runner.first_name, runner.last_name)}</span>
      <PrimaryButton isLoading={isAdding} disabled={disabled} onClick={onAdd} className="text-sm">
        {t("RankingOrganizers.addToClass", { className })}
      </PrimaryButton>
    </li>
  )
}
