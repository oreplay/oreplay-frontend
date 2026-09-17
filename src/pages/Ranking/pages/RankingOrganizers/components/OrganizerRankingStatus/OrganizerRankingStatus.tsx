import { useTranslationRanking } from "../../../../shared/useTranslationRanking.ts"
import PrimaryButton from "../../../../components/PrimaryButton.tsx"
import SpinnerRing from "../../../../components/SpinnerRing.tsx"
import StatusBadge from "./components/StatusBadge.tsx"
import { OrganizerRankingStatus as Status } from "../../shared/organizerRankingStatus.ts"

interface OrganizerRankingStatusProps {
  status: Status
  runnerClassName: string
  isAdding: boolean
  onAdd: () => void
}

export default function OrganizerRankingStatus({
  status,
  runnerClassName,
  isAdding,
  onAdd,
}: OrganizerRankingStatusProps) {
  const { t } = useTranslationRanking()

  if (status === "checking") {
    return (
      <span role="status" className="rk-organizer-ranking-status inline-flex">
        <SpinnerRing className="h-4 w-4 border-2 border-neutral-400" />
        <span className="sr-only">{t("common:loading")}</span>
      </span>
    )
  }

  if (status === "inStage") {
    return (
      <StatusBadge
        label={runnerClassName}
        className="rk-organizer-ranking-status bg-green-100 text-green-800"
      />
    )
  }

  if (status === "missing") {
    return (
      <StatusBadge
        label={t("RankingOrganizers.missing")}
        className="rk-organizer-ranking-status bg-neutral-100 text-neutral-600"
      />
    )
  }

  return (
    <PrimaryButton
      isLoading={isAdding}
      onClick={onAdd}
      className="rk-organizer-ranking-status text-sm"
    >
      {t("RankingOrganizers.addToRanking")}
    </PrimaryButton>
  )
}
