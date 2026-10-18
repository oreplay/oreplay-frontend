import { Link } from "react-router-dom"
import { competitionClassResultsPath } from "../../../../../shared/competitionLink.ts"

interface DuplicatedRunnerClassLinkProps {
  classShortName: string | null
  eventId: string
  stageId: string
}

export default function DuplicatedRunnerClassLink({
  classShortName,
  eventId,
  stageId,
}: DuplicatedRunnerClassLinkProps) {
  if (!classShortName) return null

  return (
    <Link
      to={competitionClassResultsPath(eventId, stageId, classShortName)}
      className="rk-duplicated-runner-class-link text-current underline decoration-dotted underline-offset-2 hover:text-primary hover:decoration-solid"
    >
      {classShortName}
    </Link>
  )
}
