import FlexCol from "../../../../../../../components/FlexCol.tsx"
import { Typography } from "@mui/material"
import ResultListItem from "../../../../../../../components/ResultsList/ResultListItem.tsx"
import { ProcessedOverallModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { parseSecondsToMMSS } from "../../../../../../../../../shared/Functions.tsx"

type StageResultItemProps = {
  stage: ProcessedOverallModel
}

export default function StageResultItem({ stage }: StageResultItemProps) {
  const stageDescription = stage?.stage ? stage.stage.description : `Stage ${stage.stage_order}`

  return (
    <ResultListItem>
      <FlexCol width={"10px"}>
        <Typography sx={{ fontSize: "small" }}>{`${stage.position}.`}</Typography>
      </FlexCol>
      <FlexCol flexGrow={1}>
        <Typography sx={{ fontSize: "small" }}>{stageDescription}</Typography>
      </FlexCol>
      <FlexCol flexGrow={1}>
        <Typography sx={{ fontSize: "small" }}>
          {stage.time_seconds ? parseSecondsToMMSS(stage.time_seconds) : ""}
        </Typography>
        <Typography sx={{ fontSize: "small" }}>{stage.points_final}</Typography>
      </FlexCol>
    </ResultListItem>
  )
}
