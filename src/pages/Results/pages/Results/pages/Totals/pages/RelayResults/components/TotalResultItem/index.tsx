import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import StageResultItem from "../StageResultItem"
import { Collapse } from "@mui/material"
import { memo, useCallback, useState } from "react"
import IndividualResult from "../../../../../../components/ResultsList/IndividualResult/individualResult.tsx"
import TotalResultsItemPointBasedColumn from "./components/TotalResultItemPointBasedColumn"
import { UPLOAD_TYPES } from "../../../../../../shared/constants.ts"
import TotalResultItemTimeBasedColumn from "./components/TotalResultItemTimeBasedColumn"

interface TotalsResultItemProps {
  runner: ProcessedRunnerModel
  isRunnerNC?: boolean
  isClass?: boolean // Add this prop to determine if we're in class or club view
}

export default function TotalsResultItem({
  runner,
  isClass = true, // Default to class view
}: TotalsResultItemProps) {
  const [expanded, setExpanded] = useState(false)

  const MemoIndividualResult = memo(IndividualResult)

  const handleExpandClick = useCallback(() => {
    setExpanded((value) => !value)
    const channel = new BroadcastChannel("user_interaction")
    channel.postMessage({
      type: "RUNNER_EXPANDED",
      payload: runner,
      path: window.location.pathname,
    })
  }, [runner])

  const isPointBased = runner.overalls?.overall.upload_type !== UPLOAD_TYPES.TOTAL_TIMES

  return (
    <>
      <MemoIndividualResult
        runner={runner}
        isClass={isClass}
        ResultColumn={
          isPointBased ? TotalResultsItemPointBasedColumn : TotalResultItemTimeBasedColumn
        }
        onClick={handleExpandClick}
      />
      <Collapse
        in={expanded}
        timeout={300}
        sx={{
          background:
            "linear-gradient(0deg, #00000008 0%, #F6F6F6FF 10%), linear-gradient(90deg, #00000008 0%, #F6F6F6FF 10%)",
          backgroundBlendMode: "darken",
          backgroundColor: "#f8f8f8",
          borderRadius: "0px 0px 8px 8px",
          overflow: "hidden",
        }}
      >
        {runner.overalls?.parts?.map((stage) => {
          return <StageResultItem displayContributory key={stage.id} stage={stage} />
        })}
      </Collapse>
    </>
  )
}
