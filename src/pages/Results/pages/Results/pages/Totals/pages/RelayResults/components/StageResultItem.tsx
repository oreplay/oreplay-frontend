import FlexCol from "../../../../../../../components/FlexCol.tsx"
import { Typography } from "@mui/material"
import ResultListItem from "../../../../../../../components/ResultsList/ResultListItem.tsx"
import { ProcessedOverallModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"

type StageResultItemProps = {
  stage: ProcessedOverallModel
}

export default function StageResultItem({ stage }: StageResultItemProps) {
  return (
    <ResultListItem>
      <FlexCol width={"10px"}>
        <Typography>{`${stage.position}.`}</Typography>
      </FlexCol>
      <FlexCol flexGrow={1}>
        <Typography>{`Stage ${stage.stage_order}`}</Typography>
      </FlexCol>
      <FlexCol flexGrow={1}>
        <Typography>{`${stage.time_seconds} secs`}</Typography>
        <Typography>{`${stage.points_final} pts`}</Typography>
      </FlexCol>
    </ResultListItem>
  )
}
