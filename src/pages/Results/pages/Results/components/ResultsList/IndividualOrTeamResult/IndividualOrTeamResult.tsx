import { runnerService } from "../../../../../../../domain/services/RunnerService.ts"
import IndividualResult, { IndividualResultProps } from "../IndividualResult/IndividualResult.tsx"
import TeamResult from "../TeamResult/TeamResult.tsx"

export default function IndividualOrTeamResult(props: IndividualResultProps) {
  if (runnerService.isTeam(props.runner)) {
    return <TeamResult {...props} />
  }
  return <IndividualResult {...props} />
}
