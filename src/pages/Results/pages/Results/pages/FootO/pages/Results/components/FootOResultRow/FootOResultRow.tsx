import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import IndividualResult from "../../../../../../components/ResultsList/IndividualResult/IndividualResult.tsx"
import IndividualResultColumnResultTimeAndDiff from "../../../../../../components/ResultsList/IndividualResultColumnResultTimeAndDiff/IndividualResultColumnResultTimeAndDiff.tsx"

export interface FootOResultRowProps {
  runner: ProcessedRunnerModel
  onClick: (runner: ProcessedRunnerModel) => void
  isClass: boolean
}
export default function FootOResultRow({ runner, onClick, isClass }: FootOResultRowProps) {
  return (
    <IndividualResult
      runner={runner}
      isClass={isClass}
      onClick={onClick}
      ResultColumn={IndividualResultColumnResultTimeAndDiff}
    />
  )
}
