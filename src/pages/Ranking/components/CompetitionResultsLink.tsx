import { Link } from "react-router-dom"
import { useTranslationRanking } from "../shared/useTranslationRanking.ts"
import { competitionResultsPath } from "../shared/competitionLink.ts"

interface CompetitionResultsLinkProps {
  eventId: string
  stageId: string
  className?: string
}

export default function CompetitionResultsLink({
  eventId,
  stageId,
  className,
}: CompetitionResultsLinkProps) {
  const { t } = useTranslationRanking()

  return (
    <Link
      to={competitionResultsPath(eventId, stageId)}
      className={["rk-competition-results-link text-sm text-primary hover:underline", className]
        .filter(Boolean)
        .join(" ")}
    >
      {t("Settings.competitionLink")}
    </Link>
  )
}
