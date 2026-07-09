import { ResultItemProps } from "../shared/types.ts"
import { runnerService } from "../../../../../../../domain/services/RunnerService.ts"
import IndividualResult from "../IndividualResult/IndividualResult.tsx"
import TeamResult from "../TeamResult/TeamResult.tsx"

export default function IndividualOrTeamResult(props: ResultItemProps) {
  if (runnerService.isTeam(props.runner)) {
    return <TeamResult {...props} />
  }
  return <IndividualResult {...props} />
}
