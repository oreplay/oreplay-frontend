import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import RogaineResultItemRowColumnResult from "./components/RogaineResultItemRowColumnResult.tsx"
import IndividualResult from "../../../../../../components/ResultsList/IndividualResult/individualResult.tsx"

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
    <IndividualResult
      runner={runner}
      isClass={isClass}
      onClick={onClick}
      ResultColumn={RogaineResultItemRowColumnResult}
    />
  )
}
