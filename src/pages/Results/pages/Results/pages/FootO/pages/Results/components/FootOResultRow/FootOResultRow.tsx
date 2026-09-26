import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import IndividualResultColumnResultTimeAndDiff from "../../../../../../components/ResultsList/IndividualResultColumnResultTimeAndDiff/IndividualResultColumnResultTimeAndDiff.tsx"
import IndividualOrTeamResult from "../../../../../../components/ResultsList/IndividualOrTeamResult/IndividualOrTeamResult.tsx"

export interface FootOResultRowProps {
  runner: ProcessedRunnerModel
  onClick: (runner: ProcessedRunnerModel) => void
  isClass: boolean
}
export default function FootOResultRow({ runner, onClick, isClass }: FootOResultRowProps) {
  return (
    <IndividualOrTeamResult
      runner={runner}
      isClass={isClass}
      onClick={onClick}
      ResultColumn={IndividualResultColumnResultTimeAndDiff}
    />
  )
}
