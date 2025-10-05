import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import IndividualResult from "../../../../../components/ResultsList/IndividualResult/individualResult.tsx"
import IndividualResultColumnResultTimeAndDiff from "../../../../../components/ResultsList/IndividualResultColumnResultTimeAndDiff"

interface OneManRelayResultItemProps {
  runner: ProcessedRunnerModel
  isClass: boolean
  onClick: (runner: ProcessedRunnerModel) => void
}

export default function OneManRelayResultItem({
  runner,
  isClass,
  onClick,
}: OneManRelayResultItemProps) {
  return (
    <IndividualResult
      runner={runner}
      isClass={isClass}
      onClick={onClick}
      ResultColumn={IndividualResultColumnResultTimeAndDiff}
    />
  )
}
