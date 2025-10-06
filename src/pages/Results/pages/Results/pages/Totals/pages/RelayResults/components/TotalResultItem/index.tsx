import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import Index from "../StageResultItem"
import { Box, Collapse } from "@mui/material"
import { RunnerModel } from "../../../../../../../../../../shared/EntityTypes.ts"
import { memo, useCallback, useState } from "react"
import IndividualResult from "../../../../../../components/ResultsList/IndividualResult/individualResult.tsx"
import TotalResultsItemPointBasedColumn from "./components/TotalResultItemPointBasedColumn"
import { runnerService } from "../../../../../../../../../../domain/services/RunnerService.ts"
import { UPLOAD_TYPES } from "../../../../../../shared/constants.ts"
import TotalResultItemTimeBasedColumn from "./components/TotalResultItemTimeBasedColumn"

interface EnhancedTotalsResultItemProps {
  runner: ProcessedRunnerModel
  isRunnerNC?: boolean
  handleRowClick: (runner: RunnerModel) => void
  isClass?: boolean // Add this prop to determine if we're in class or club view
}

export default function TotalsResultItem({
  runner,
  isClass = true, // Default t
  // o class view
}: EnhancedTotalsResultItemProps) {
  const [expanded, setExpanded] = useState(false)

  const MemoIndividualResult = memo(IndividualResult)

  const handleExpandClick = useCallback(() => {
    setExpanded((value) => !value)
  }, [setExpanded])

  const isPointBased = runner.overalls?.overall.upload_type !== UPLOAD_TYPES.TOTAL_TIMES

  return (
    <div>
      <MemoIndividualResult
        runner={runner}
        isClass={isClass}
        ResultColumn={
          isPointBased ? TotalResultsItemPointBasedColumn : TotalResultItemTimeBasedColumn
        }
        onClick={handleExpandClick}
      />
      <Collapse in={expanded} timeout={300}>
        <Box
          sx={{
            backgroundColor: "#f8f9fa",
            borderRadius: "0 0 8px 8px",
            overflow: "hidden",
          }}
        >
          {runner.overalls?.parts?.map((stage) => {
            return <Index key={stage.id} stage={stage} isRunnerNC={runnerService.isNC(runner)} />
          })}
        </Box>
      </Collapse>
    </div>
  )
}
