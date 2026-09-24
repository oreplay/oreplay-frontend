import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import StageResultItem from "../StageResultItem/StageResultItem.tsx"
import { memo, useCallback, useState } from "react"
import IndividualResult from "../../../../../../components/ResultsList/IndividualResult/IndividualResult.tsx"
import TotalResultsItemPointBasedColumn from "./components/TotalResultItemPointBasedColumn/TotalResultItemPointBasedColumn.tsx"
import { UPLOAD_TYPES } from "../../../../../../shared/constants.ts"
import TotalResultItemTimeBasedColumn from "./components/TotalResultItemTimeBasedColumn/TotalResultItemTimeBasedColumn.tsx"

interface TotalsResultItemProps {
  runner: ProcessedRunnerModel
  isRunnerNC?: boolean
  isClass?: boolean // Add this prop to determine if we're in class or club view
}

export default function TotalsResultItem({
  runner,
  isClass = true, // Default t
  // o class view
}: TotalsResultItemProps) {
  const [expanded, setExpanded] = useState(false)

  const MemoIndividualResult = memo(IndividualResult)

  const handleExpandClick = useCallback(() => {
    setExpanded((value) => !value)
  }, [setExpanded])

  const isPointBased = runner.overalls?.overall.upload_type !== UPLOAD_TYPES.TOTAL_TIMES

  return (
    <div className="min-w-0">
      <MemoIndividualResult
        runner={runner}
        isClass={isClass}
        ResultColumn={
          isPointBased ? TotalResultsItemPointBasedColumn : TotalResultItemTimeBasedColumn
        }
        onClick={handleExpandClick}
      />
      <div
        aria-hidden={!expanded}
        className={`grid overflow-hidden bg-[#f8f8f8] transition-[grid-template-rows] duration-300 ease-in-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          {runner.overalls?.parts?.map((stage) => (
            <StageResultItem displayContributory key={stage.id} stage={stage} />
          ))}
        </div>
      </div>
    </div>
  )
}
