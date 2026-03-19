import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import RogaineResultItemRowColumnResult from "./components/RogaineResultItemRowColumnResult.tsx"
import IndividualOrTeamResult from "../../../../../../components/ResultsList/IndividualOrTeamResult"

interface RogaineResultItemRowProps {
  runner: ProcessedRunnerModel
  isClass: boolean
  onClick: (runner: ProcessedRunnerModel) => void
}

export default function RogaineResultItemRow({
  runner,
  isClass,
  onClick,
}: RogaineResultItemRowProps) {
  return (
    <IndividualOrTeamResult
      runner={runner}
      isClass={isClass}
      onClick={onClick}
      ResultColumn={RogaineResultItemRowColumnResult}
    />
  )
}
